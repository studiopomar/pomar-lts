'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from './LanguageContext';
import { useSound } from './SoundEffects';

interface PhonemeItem {
  symbol: string;
  ipa: string;
  category: 'vowel' | 'consonant';
  type: string;
  examples: string;
  description: string;
  accent?: string;
}

interface TransitionRule {
  syntax: string;
  name: string;
  example: string;
  explanation: string;
}

export default function BrapaGuide() {
  const { t, language } = useLanguage();
  const { playClick } = useSound();
  const [activeTab, setActiveTab] = useState<'vowels' | 'consonants' | 'rules' | 'tips'>('vowels');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const phonemes: PhonemeItem[] = useMemo(() => {
    return [
      // Oral Vowels
      { symbol: 'a', ipa: '/a/', category: 'vowel', type: 'Vogal Oral Aberta', examples: 'a-m-o-r, c-a-s-a', description: 'Vogal central aberta padrão do português.' },
      { symbol: 'e', ipa: '/e/', category: 'vowel', type: 'Vogal Oral Fechada', examples: 'v-o-c-ê, m-e-d-o', description: 'Vogal anterior semi-fechada (som de ê).' },
      { symbol: 'E', ipa: '/ɛ/', category: 'vowel', type: 'Vogal Oral Aberta', examples: 'p-é, f-e-s-t-a', description: 'Vogal anterior semi-aberta (som de é aberto).' },
      { symbol: 'i', ipa: '/i/', category: 'vowel', type: 'Vogal Oral Fechada', examples: 'd-i-a, a-q-u-i', description: 'Vogal anterior fechada.' },
      { symbol: 'o', ipa: '/o/', category: 'vowel', type: 'Vogal Oral Fechada', examples: 'a-v-ô, o-l-h-o', description: 'Vogal posterior semi-fechada (som de ô).' },
      { symbol: 'O', ipa: '/ɔ/', category: 'vowel', type: 'Vogal Oral Aberta', examples: 'p-ó, s-o-l', description: 'Vogal posterior semi-aberta (som de ó aberto).' },
      { symbol: 'u', ipa: '/u/', category: 'vowel', type: 'Vogal Oral Fechada', examples: 'u-v-a, a-z-u-l', description: 'Vogal posterior fechada.' },
      
      // Nasal Vowels
      { symbol: 'an', ipa: '/ɐ̃/', category: 'vowel', type: 'Vogal Nasal', examples: 'c-a-n-t-o, m-ã-e', description: 'Vogal central nasalizada.' },
      { symbol: 'en', ipa: '/ẽ/', category: 'vowel', type: 'Vogal Nasal', examples: 'v-e-n-t-o, s-e-m-p-r-e', description: 'Vogal anterior semi-fechada nasalizada.' },
      { symbol: 'in', ipa: '/ĩ/', category: 'vowel', type: 'Vogal Nasal', examples: 'f-i-m, c-i-n-t-o', description: 'Vogal anterior fechada nasalizada.' },
      { symbol: 'on', ipa: '/õ/', category: 'vowel', type: 'Vogal Nasal', examples: 's-o-m, p-o-n-t-e', description: 'Vogal posterior semi-fechada nasalizada.' },
      { symbol: 'un', ipa: '/ũ/', category: 'vowel', type: 'Vogal Nasal', examples: 'u-m, j-u-n-t-o', description: 'Vogal posterior fechada nasalizada.' },

      // Semivowels / Glides
      { symbol: 'w', ipa: '/w/', category: 'vowel', type: 'Semivogal / Glide', examples: 'p-a-u, m-e-u, q-u-a-n-d-o', description: 'Semivogal posterior (equivalente ao [u] átono em ditongos).' },
      { symbol: 'j', ipa: '/j/', category: 'vowel', type: 'Semivogal / Glide', examples: 'p-a-i, r-e-i, f-o-i', description: 'Semivogal anterior (equivalente ao [i] átono em ditongos).' },

      // Plosive Consonants
      { symbol: 'p', ipa: '/p/', category: 'consonant', type: 'Oclusiva Bilabial', examples: 'p-a-i, p-o-r-t-a', description: 'Oclusiva bilabial desvozeada.' },
      { symbol: 'b', ipa: '/b/', category: 'consonant', type: 'Oclusiva Bilabial', examples: 'b-o-m, b-a-r-c-o', description: 'Oclusiva bilabial vozeada.' },
      { symbol: 't', ipa: '/t/', category: 'consonant', type: 'Oclusiva Alveolar', examples: 't-u-d-o, t-e-t-o', description: 'Oclusiva alveolar desvozeada pura.' },
      { symbol: 'd', ipa: '/d/', category: 'consonant', type: 'Oclusiva Alveolar', examples: 'd-a-r, d-o-c-e', description: 'Oclusiva alveolar vozeada pura.' },
      { symbol: 'k', ipa: '/k/', category: 'consonant', type: 'Oclusiva Velar', examples: 'c-a-s-a, q-u-e-r-o', description: 'Oclusiva velar desvozeada (sons de c/qu).' },
      { symbol: 'g', ipa: '/ɡ/', category: 'consonant', type: 'Oclusiva Velar', examples: 'g-a-t-o, g-u-i-a', description: 'Oclusiva velar vozeada (sons de g/gu).' },

      // Fricative Consonants
      { symbol: 'f', ipa: '/f/', category: 'consonant', type: 'Fricativa Labiodental', examples: 'f-o-g-o, f-á-c-i-l', description: 'Fricativa labiodental desvozeada.' },
      { symbol: 'v', ipa: '/v/', category: 'consonant', type: 'Fricativa Labiodental', examples: 'v-e-n-t-o, v-i-d-a', description: 'Fricativa labiodental vozeada.' },
      { symbol: 's', ipa: '/s/', category: 'consonant', type: 'Fricativa Alveolar', examples: 's-o-l, p-a-s-s-o, c-e-d-o', description: 'Fricativa alveolar desvozeada (som de s/ss/ç).' },
      { symbol: 'z', ipa: '/z/', category: 'consonant', type: 'Fricativa Alveolar', examples: 'z-e-b-r-a, c-a-s-a', description: 'Fricativa alveolar vozeada (som de z ou s intervocálico).' },
      { symbol: 'S', ipa: '/ʃ/', category: 'consonant', type: 'Fricativa Pós-Alveolar', examples: 'c-h-a-v-e, x-a-d-r-e-z', description: 'Fricativa pós-alveolar desvozeada (som de ch/x).' },
      { symbol: 'Z', ipa: '/ʒ/', category: 'consonant', type: 'Fricativa Pós-Alveolar', examples: 'j-a-r-d-i-m, g-e-n-t-e', description: 'Fricativa pós-alveolar vozeada (som de j/g).' },

      // Affricates
      { symbol: 'tS', ipa: '/tʃ/', category: 'consonant', type: 'Africada Pós-Alveolar', examples: 't-c-h-a-u, t-i-m-e (palatal)', description: 'Africada pós-alveolar desvozeada (som de tch ou ti em dialetos sudeste).' },
      { symbol: 'dZ', ipa: '/dʒ/', category: 'consonant', type: 'Africada Pós-Alveolar', examples: 'd-i-a (palatal), j-e-e-p', description: 'Africada pós-alveolar vozeada (som de dj ou di em dialetos sudeste).' },

      // Nasal Consonants
      { symbol: 'm', ipa: '/m/', category: 'consonant', type: 'Nasal Bilabial', examples: 'm-ã-e, m-u-i-t-o', description: 'Nasal bilabial sonora.' },
      { symbol: 'n', ipa: '/n/', category: 'consonant', type: 'Nasal Alveolar', examples: 'n-a-d-a, n-o-i-t-e', description: 'Nasal alveolar sonora.' },
      { symbol: 'nh', ipa: '/ɲ/', category: 'consonant', type: 'Nasal Palatal', examples: 's-o-n-h-o, a-m-a-n-h-ã', description: 'Nasal palatal sonora (som de nh).' },

      // Liquids & Rhotics
      { symbol: 'l', ipa: '/l/', category: 'consonant', type: 'Lateral Alveolar', examples: 'l-u-a, l-i-v-r-e', description: 'Lateral alveolar sonora.' },
      { symbol: 'lh', ipa: '/ʎ/', category: 'consonant', type: 'Lateral Palatal', examples: 'o-l-h-o, f-i-l-h-o', description: 'Lateral palatal sonora (som de lh).' },
      { symbol: 'r', ipa: '/ɾ/', category: 'consonant', type: 'Tepe Alveolar (R brando)', examples: 'c-a-r-o, p-r-a-t-o', description: 'Tepe alveolar (vibração simples de R entre vogais ou em encontros consonantais).' },
      { symbol: 'R', ipa: '/ʁ/ ou /h/', category: 'consonant', type: 'Fricativa Glotal/Uvular (R forte)', examples: 'r-u-a, c-a-r-r-o', description: 'R forte no início de palavra ou duplo (aspirado ou uvular).' },
    ];
  }, []);

  const transitionRules: TransitionRule[] = useMemo(() => {
    return [
      {
        syntax: '- V',
        name: 'Ataque de Início de Frase',
        example: '- a, - e, - in',
        explanation: 'Indica a transição suave vinda do silêncio para a vogal no início de uma frase ou nota solo.',
      },
      {
        syntax: 'C V',
        name: 'Consoante + Vogal',
        example: 'k a, tS i, b o',
        explanation: 'A sílaba padrão formada pela consoante inicial e a vogal sustentada da nota.',
      },
      {
        syntax: 'V C',
        name: 'Transição Vogal + Consoante',
        example: 'a k, e m, o s',
        explanation: 'Nota curta colocada antes da próxima sílaba para criar a ligação perfeita entre a vogal anterior e a consoante seguinte.',
      },
      {
        syntax: 'V -',
        name: 'Finalização de Vogal',
        example: 'a -, e -, on -',
        explanation: 'Liberação natural com respiração/fade ao final de frases ou antes de pausas.',
      },
      {
        syntax: 'C -',
        name: 'Finalização de Consoante',
        example: 's -, r -, m -',
        explanation: 'Encerramento de palavras que terminam em consoante sem vogal de apoio (ex.: "mar", "paz").',
      },
      {
        syntax: 'V V',
        name: 'Ligação Contínua de Vogais (Ditongos & Hiatos)',
        example: 'a i, e u, o a',
        explanation: 'Transição suave entre duas vogais consecutivas sem ataque de respiração.',
      },
    ];
  }, []);

  const filteredPhonemes = useMemo(() => {
    return phonemes.filter((p) => {
      if (activeTab === 'vowels' && p.category !== 'vowel') return false;
      if (activeTab === 'consonants' && p.category !== 'consonant') return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.symbol.toLowerCase().includes(q) ||
        p.ipa.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.examples.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [phonemes, activeTab, searchQuery]);

  const copyPhoneme = (symbol: string) => {
    navigator.clipboard?.writeText(symbol);
    setCopiedSymbol(symbol);
    playClick();
    setTimeout(() => {
      setCopiedSymbol((prev) => (prev === symbol ? null : prev));
    }, 1800);
  };

  return (
    <section className="brapa-guide-section" id="guia-brapa">
      <div className="shell">
        <div className="section-head light-head">
          <div>
            <p className="eyebrow">{language === 'pt' ? '03 · FONÉTICA BRAPA' : '03 · BRAPA PHONETICS'}</p>
            <h2>
              {language === 'pt' ? 'O Alfabeto da Voz' : 'The Alphabet of Voice'}
              <br />
              <em>{language === 'pt' ? 'Brasileira.' : 'in Brazil.'}</em>
            </h2>
          </div>
          <p>
            {language === 'pt'
              ? 'Guia interativo do padrão BRAPA (Brazilian Portuguese Alphabet) para criação de USTs, afinação expressiva e gravação no UTAU e OpenUTAU.'
              : 'Interactive guide to the BRAPA standard for UST crafting, expressive pitch tuning, and voicebank development in UTAU & OpenUTAU.'}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="brapa-tabs-container">
          <div className="brapa-tabs-list" role="tablist">
            <button
              className={`brapa-tab-btn ${activeTab === 'vowels' ? 'active' : ''}`}
              onClick={() => { setActiveTab('vowels'); playClick(); }}
              role="tab"
              aria-selected={activeTab === 'vowels'}
            >
              🅰️ {language === 'pt' ? 'Vogais & Ditongos' : 'Vowels & Diphthongs'}
            </button>
            <button
              className={`brapa-tab-btn ${activeTab === 'consonants' ? 'active' : ''}`}
              onClick={() => { setActiveTab('consonants'); playClick(); }}
              role="tab"
              aria-selected={activeTab === 'consonants'}
            >
              🔤 {language === 'pt' ? 'Consoantes & Encontros' : 'Consonants & Clusters'}
            </button>
            <button
              className={`brapa-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
              onClick={() => { setActiveTab('rules'); playClick(); }}
              role="tab"
              aria-selected={activeTab === 'rules'}
            >
              ⚡ {language === 'pt' ? 'Sintaxe & Transições' : 'Syntax & Transitions'}
            </button>
            <button
              className={`brapa-tab-btn ${activeTab === 'tips' ? 'active' : ''}`}
              onClick={() => { setActiveTab('tips'); playClick(); }}
              role="tab"
              aria-selected={activeTab === 'tips'}
            >
              💡 {language === 'pt' ? 'Dicas de Produção' : 'Production Tips'}
            </button>
          </div>

          {(activeTab === 'vowels' || activeTab === 'consonants') && (
            <div className="brapa-search-wrap">
              <input
                type="text"
                className="brapa-search-input"
                placeholder={language === 'pt' ? 'Buscar fonema (ex: nasal, é, ch, tepe)...' : 'Search phoneme (e.g. nasal, open e, affricate)...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="brapa-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpar busca"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab 1 & 2: Phonemes Grid */}
        {(activeTab === 'vowels' || activeTab === 'consonants') && (
          <div className="brapa-phonemes-grid">
            {filteredPhonemes.map((p) => (
              <div
                className="phoneme-card"
                key={p.symbol}
                onClick={() => copyPhoneme(p.symbol)}
                title="Clique para copiar o fonema"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') copyPhoneme(p.symbol); }}
              >
                <div className="phoneme-card-header">
                  <span className="phoneme-symbol">[{p.symbol}]</span>
                  <span className="phoneme-ipa">{p.ipa}</span>
                </div>
                <div className="phoneme-type">{p.type}</div>
                <div className="phoneme-examples">
                  <strong>Ex:</strong> {p.examples}
                </div>
                <p className="phoneme-desc">{p.description}</p>
                <div className="phoneme-copy-hint">
                  {copiedSymbol === p.symbol ? (
                    <span className="copied-tag">✓ Copiado!</span>
                  ) : (
                    <span className="copy-btn-text">Copiar fonema ⎘</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Transition Rules */}
        {activeTab === 'rules' && (
          <div className="brapa-rules-grid">
            {transitionRules.map((rule) => (
              <div className="brapa-rule-card" key={rule.syntax}>
                <div className="rule-card-syntax">
                  <code>[{rule.syntax}]</code>
                </div>
                <div className="rule-card-body">
                  <h3 className="rule-card-name">{rule.name}</h3>
                  <div className="rule-card-example">
                    <span>Exemplo UST:</span> <strong>{rule.example}</strong>
                  </div>
                  <p className="rule-card-desc">{rule.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Production Tips */}
        {activeTab === 'tips' && (
          <div className="brapa-tips-container">
            <div className="brapa-tip-card">
              <span className="tip-number">01</span>
              <h3>Transições VC Naturais (Overlap & Preutterance)</h3>
              <p>
                No padrão BRAPA, o encaixe perfeito das notas de transição <code>[V C]</code> depende do overlap correto da consoante. No OpenUTAU ou UTAU clássico, ajuste o <em>Preutterance</em> para que a consoante comece antes do compasso da nota seguinte, mantendo a métrica rítmica impecável.
              </p>
            </div>

            <div className="brapa-tip-card">
              <span className="tip-number">02</span>
              <h3>Vogais Abertas vs. Fechadas ([e] vs [E], [o] vs [O])</h3>
              <p>
                Diferenciar <code>[e]</code> (como em <em>você</em>) de <code>[E]</code> (como em <em>pé</em>), e <code>[o]</code> (como em <em>avô</em>) de <code>[O]</code> (como em <em>avó</em>) é o segredo para o sotaque autêntico e natural do português brasileiro.
              </p>
            </div>

            <div className="brapa-tip-card">
              <span className="tip-number">03</span>
              <h3>Encontros com [w] e [j] em Ditongos</h3>
              <p>
                Palavras como <em>meu</em> ou <em>foi</em> soam muito mais articuladas quando usamos a combinação <code>[e w]</code> ou <code>[o j]</code> com notas curtas (32nd ou 16th notes) em vez de notas únicas.
              </p>
            </div>

            <div className="brapa-tip-card">
              <span className="tip-number">04</span>
              <h3>Uso de Fonemizadores no OpenUTAU</h3>
              <p>
                Ao utilizar bancos de voz do Studio Pomar no OpenUTAU, selecione o <strong>BR Portuguese Phonemizer</strong> para converter automaticamente texto comum em fonemas BRAPA com alinhamento automático de notas <code>[V C]</code> e <code>[C V]</code>!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
