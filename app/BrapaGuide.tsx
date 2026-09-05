'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from './LanguageContext';
import { useSound } from './SoundEffects';
import {
  VowelIcon,
  ConsonantsIcon,
  FlashIcon,
  LightbulbIcon,
  CopyIcon,
  CheckIcon,
  CloseIcon,
  DownloadIcon,
  ExternalLinkIcon,
} from './Icons';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

interface PhonemeItem {
  symbol: string;
  xSampa: string;
  category: 'vowel' | 'semivowel' | 'consonant';
  type: string;
  exampleWord: string;
  examplePhonetic: string;
  notes?: string;
  regional?: string;
}

interface TransitionRule {
  syntax: string;
  name: string;
  example: string;
  explanation: string;
}

export default function BrapaGuide() {
  const { t, language } = useLanguage();
  const { playClick, playCopy } = useSound();
  const [activeTab, setActiveTab] = useState<'vowels' | 'consonants' | 'rules' | 'tips'>('vowels');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const phonemes: PhonemeItem[] = useMemo(() => {
    return [
      // Vogais (23)
      { symbol: 'a', xSampa: 'a', category: 'vowel', type: 'Vogal anterior aberta não arredondada', exampleWord: 'Amigo', examplePhonetic: '[a m i g u]', notes: 'Vogal oral padrão' },
      { symbol: 'ao', xSampa: 'A', category: 'vowel', type: 'Vogal posterior aberta não arredondada', exampleWord: 'Pórta / Pedestal', examplePhonetic: '(4)[p ao x t a] / (9)[p e d e s t ao w]', notes: 'Vogal aberta posterior', regional: 'Regional (4 & 9)' },
      { symbol: 'ah', xSampa: 'V', category: 'vowel', type: 'Vogal posterior semiaberta não arredondada', exampleWord: 'Saudade', examplePhonetic: '[s ah w d a dj i]', notes: 'Ditongo com /w/' },
      { symbol: 'ahn', xSampa: 'V~', category: 'vowel', type: '/V/ Nasal', exampleWord: 'Mão', examplePhonetic: '[m ahn w]', notes: 'Ditongo nasal' },
      { symbol: 'ax', xSampa: '6', category: 'vowel', type: 'Xuá aberta', exampleWord: 'Câmera', examplePhonetic: '[k ax m e r a]', notes: 'Vogal central' },
      { symbol: 'an', xSampa: '6~', category: 'vowel', type: '/6/ Nasal', exampleWord: 'Amante', examplePhonetic: '[a m an ch i]', notes: 'Vogal central nasal' },
      { symbol: 'e', xSampa: 'e', category: 'vowel', type: 'Vogal anterior semifechada não arredondada', exampleWord: 'Exausto', examplePhonetic: '[e z a w s t u]', notes: 'Vogal fechada oral (ê)' },
      { symbol: 'en', xSampa: 'e~', category: 'vowel', type: '/e/ Nasal', exampleWord: 'Tempo', examplePhonetic: '[t en p u]', notes: 'Vogal anterior nasal' },
      { symbol: 'eh', xSampa: 'E', category: 'vowel', type: 'Vogal frontal semiaberta não arredondada', exampleWord: 'Até', examplePhonetic: '[a t eh]', notes: 'Vogal aberta oral (é)' },
      { symbol: 'ehn', xSampa: 'E~', category: 'vowel', type: '/E/ Nasal', exampleWord: 'Sento', examplePhonetic: '[s ehn t u]', notes: 'Situacional' },
      { symbol: 'ae', xSampa: '{', category: 'vowel', type: 'Vogal anterior quase aberta', exampleWord: 'Pedra', examplePhonetic: '[p ae d r a]', notes: 'Variante aberta' },
      { symbol: 'aen', xSampa: '{~', category: 'vowel', type: '/{/ Nasal', exampleWord: 'Penha', examplePhonetic: '[p aen nh a]', notes: 'Nasalização aberta', regional: 'Regional (13 & 3)' },
      { symbol: 'i', xSampa: 'i', category: 'vowel', type: 'Vogal anterior fechada não arredondada', exampleWord: 'Figo', examplePhonetic: '[f i g u]', notes: 'Vogal alta oral' },
      { symbol: 'in', xSampa: 'i~', category: 'vowel', type: '/i/ Nasal', exampleWord: 'Simples', examplePhonetic: '[s in p l i s]', notes: 'Vogal alta nasal' },
      { symbol: 'i0', xSampa: 'I', category: 'vowel', type: 'Vogal fechada lassa não arredondada', exampleWord: 'Neném', examplePhonetic: '[n i0 n en y]', notes: 'Neutralização átona' },
      { symbol: 'o', xSampa: 'o', category: 'vowel', type: 'Vogal semifechada posterior arredondada', exampleWord: 'Hospital', examplePhonetic: '[o s p i t a w]', notes: 'Vogal fechada oral (ô)' },
      { symbol: 'on', xSampa: 'o~', category: 'vowel', type: '/o/ Nasal', exampleWord: 'Som', examplePhonetic: '[s on]', notes: 'Vogal posterior nasal' },
      { symbol: 'oh', xSampa: 'O', category: 'vowel', type: 'Vogal posterior semiaberta arredondada', exampleWord: 'Pó', examplePhonetic: '[p oh]', notes: 'Vogal aberta oral (ó)' },
      { symbol: 'ohn', xSampa: 'O~', category: 'vowel', type: '/O/ Nasal', exampleWord: 'Põe', examplePhonetic: '[p ohn y]', notes: 'Vogal posterior nasal' },
      { symbol: 'u', xSampa: 'u', category: 'vowel', type: 'Vogal posterior fechada arredondada', exampleWord: 'Sul', examplePhonetic: '[s u w]', notes: 'Vogal alta posterior' },
      { symbol: 'un', xSampa: 'u~', category: 'vowel', type: '/u/ Nasal', exampleWord: 'Mundo', examplePhonetic: '[m un d u]', notes: 'Vogal alta nasal' },
      { symbol: 'u0', xSampa: 'U', category: 'vowel', type: 'Vogal fechada lassa arredondada', exampleWord: 'Solto', examplePhonetic: '[s o w t u0]', notes: 'Neutralização átona' },
      { symbol: 'rh', xSampa: '@`', category: 'vowel', type: 'Vogal roticizada (R-colored)', exampleWord: 'Carne', examplePhonetic: '[k a rh n i]', notes: 'Vocalização retroflexa', regional: 'Regional (1 & 10)' },

      // Semivogais (2)
      { symbol: 'y', xSampa: 'j', category: 'vowel', type: 'Semivogal / Aproximante palatal', exampleWord: 'Pai / Yatch', examplePhonetic: '[p a y] / [y a ch]', notes: 'Ditongos com i' },
      { symbol: 'w', xSampa: 'w', category: 'vowel', type: 'Semivogal / Aproximante labiovelar', exampleWord: 'Meu / Wav', examplePhonetic: '[m e w] / [w a v]', notes: 'Ditongos com u' },

      // Consoantes (29)
      { symbol: 'b', xSampa: 'b', category: 'consonant', type: 'Oclusiva bilabial sonora', exampleWord: 'Bolo', examplePhonetic: '[b o l u]' },
      { symbol: 'bv', xSampa: 'B', category: 'consonant', type: 'Fricativa bilabial sonora', exampleWord: 'Cabo', examplePhonetic: '[k a bv u]', notes: 'Alofone de /b/' },
      { symbol: 'ch', xSampa: 'tS', category: 'consonant', type: 'Africada pós-alveolar surda', exampleWord: 'Tchau', examplePhonetic: '[ch a w]' },
      { symbol: 'd', xSampa: 'd', category: 'consonant', type: 'Oclusiva alveolar sonora', exampleWord: 'Dor', examplePhonetic: '[d o h]' },
      { symbol: 'dj', xSampa: 'dZ', category: 'consonant', type: 'Africada pós-alveolar sonora', exampleWord: 'Dizer', examplePhonetic: '[dj i z e h]' },
      { symbol: 'f', xSampa: 'f', category: 'consonant', type: 'Fricativa labiodental surda', exampleWord: 'Fada', examplePhonetic: '[f a d ax]' },
      { symbol: 'g', xSampa: 'g', category: 'consonant', type: 'Oclusiva velar sonora', exampleWord: 'Gato', examplePhonetic: '[g a t u]' },
      { symbol: 'gv', xSampa: 'G', category: 'consonant', type: 'Fricativa velar sonora', exampleWord: 'Agora', examplePhonetic: '[a gv o r a]', notes: 'Alofone de /g/' },
      { symbol: 'h', xSampa: 'h', category: 'consonant', type: 'Fricativa glotal surda', exampleWord: 'Carro', examplePhonetic: '[k a h u]' },
      { symbol: 'hr', xSampa: 'R', category: 'consonant', type: 'Fricativa uvular sonora', exampleWord: 'Ranço', examplePhonetic: '[hr a n s u]', regional: 'Regional (4 & 11)' },
      { symbol: 'j', xSampa: 'Z', category: 'consonant', type: 'Fricativa palatoalveolar sonora', exampleWord: 'Já', examplePhonetic: '[j a]' },
      { symbol: 'k', xSampa: 'k', category: 'consonant', type: 'Oclusiva velar surda', exampleWord: 'Cor', examplePhonetic: '[k o h]' },
      { symbol: 'l', xSampa: 'l', category: 'consonant', type: 'Lateral aproximante alveolar', exampleWord: 'Lágrima', examplePhonetic: '[l a g r i m a]' },
      { symbol: 'lh', xSampa: 'L', category: 'consonant', type: 'Lateral palatal', exampleWord: 'Palhaço', examplePhonetic: '[p a lh a s u0]' },
      { symbol: 'l0', xSampa: '5', category: 'consonant', type: 'Aproximante lateral velarizado', exampleWord: 'Livro', examplePhonetic: '[l0 i v r u]' },
      { symbol: 'm', xSampa: 'm', category: 'consonant', type: 'Nasal bilabial', exampleWord: 'Mês', examplePhonetic: '[m e s]' },
      { symbol: 'n', xSampa: 'n', category: 'consonant', type: 'Nasal alveolar', exampleWord: 'Navio', examplePhonetic: '[n a v i w]' },
      { symbol: 'ng', xSampa: 'N', category: 'consonant', type: 'Nasal velar', exampleWord: 'Manga', examplePhonetic: '[m an ng a]', notes: 'Alofone de /n/' },
      { symbol: 'nh', xSampa: 'J', category: 'consonant', type: 'Nasal palatal', exampleWord: 'Sonho', examplePhonetic: '[s o nh u]' },
      { symbol: 'p', xSampa: 'p', category: 'consonant', type: 'Oclusiva bilabial surda', exampleWord: 'Pipoca', examplePhonetic: '[p i p o k a]' },
      { symbol: 'r', xSampa: '4', category: 'consonant', type: 'Vibrante alveolar simples (Tepe)', exampleWord: 'Pará', examplePhonetic: '[p a r a]' },
      { symbol: 'rr', xSampa: 'r', category: 'consonant', type: 'Vibrante alveolar múltipla', exampleWord: 'Rato', examplePhonetic: '[rr a t u]' },
      { symbol: 'rw', xSampa: 'r\\', category: 'consonant', type: 'Aproximante retroflexa', exampleWord: 'Amor', examplePhonetic: '[a m o rw]', regional: 'Centro-Sul' },
      { symbol: 's', xSampa: 's', category: 'consonant', type: 'Fricativa alveolar surda', exampleWord: 'Sorte', examplePhonetic: '[s oh x ch i]' },
      { symbol: 'sh', xSampa: 'S', category: 'consonant', type: 'Fricativa palatoalveolar surda', exampleWord: 'Chão', examplePhonetic: '[sh an w]' },
      { symbol: 't', xSampa: 't', category: 'consonant', type: 'Oclusiva alveolar surda', exampleWord: 'Torta', examplePhonetic: '[t oh rh t a]' },
      { symbol: 'v', xSampa: 'v', category: 'consonant', type: 'Fricativa labiodental sonora', exampleWord: 'Vaso', examplePhonetic: '[v a z u0]' },
      { symbol: 'x', xSampa: 'x', category: 'consonant', type: 'Fricativa velar surda (Chiado)', exampleWord: 'Partir', examplePhonetic: '[p a x ch i x]', regional: 'Regional (4 - RJ)' },
      { symbol: 'z', xSampa: 'z', category: 'consonant', type: 'Fricativa alveolar sonora', exampleWord: 'Zebra', examplePhonetic: '[z e b r ax]' },
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
        example: 'k a, ch i, b o',
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
        example: 's -, r -, m -, x -',
        explanation: 'Encerramento de palavras que terminam em consoante sem vogal de apoio (ex.: "mar", "paz").',
      },
      {
        syntax: 'V V',
        name: 'Ligação Contínua de Vogais (Ditongos & Hiatos)',
        example: 'a y, e w, o a',
        explanation: 'Transição suave entre duas vogais consecutivas sem ataque de respiração.',
      },
    ];
  }, []);

  const filteredPhonemes = useMemo(() => {
    return phonemes.filter((p) => {
      if (activeTab === 'vowels' && p.category !== 'vowel') return false;
      if (activeTab === 'consonants' && p.category !== 'consonant') return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.symbol.toLowerCase().includes(q) ||
        p.xSampa.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.exampleWord.toLowerCase().includes(q) ||
        p.examplePhonetic.toLowerCase().includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q)) ||
        (p.regional && p.regional.toLowerCase().includes(q))
      );
    });
  }, [phonemes, activeTab, searchQuery]);

  const handleCopy = (symbol: string) => {
    if (playCopy) playCopy();
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(symbol).catch(() => {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = symbol;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        } catch {}
      });
    } else {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = symbol;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {}
    }
    setCopiedSymbol(symbol);
    setTimeout(() => setCopiedSymbol(null), 2000);
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
          <div>
            <p>
              {language === 'pt'
                ? 'Guia oficial do padrão BRAPA (Team-BRAPA) baseado em Arpabet para sintetizadores de canto (UTAU, DiffSinger, OpenUTAU).'
                : 'Official BRAPA standard guide (Team-BRAPA) built on Arpabet for singing voice synthesis (UTAU, DiffSinger, OpenUTAU).'}
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a 
                href={`${basePath}/brapa/`} 
                className="button button-dark"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Explorar Cartela Completa</span>
                <ExternalLinkIcon size={13} />
              </a>
              <a 
                href="https://raw.githubusercontent.com/Team-BRAPA/BRAPA/main/SPREADSHEETS/BRAPA.xlsx" 
                className="button button-ghost"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                download
              >
                <DownloadIcon size={13} />
                <span>XLSX</span>
              </a>
            </div>
          </div>
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
              <VowelIcon size={15} />
              <span>{language === 'pt' ? 'Vogais & Semivogais' : 'Vowels & Semivowels'}</span>
            </button>
            <button
              className={`brapa-tab-btn ${activeTab === 'consonants' ? 'active' : ''}`}
              onClick={() => { setActiveTab('consonants'); playClick(); }}
              role="tab"
              aria-selected={activeTab === 'consonants'}
            >
              <ConsonantsIcon size={15} />
              <span>{language === 'pt' ? 'Consoantes' : 'Consonants'}</span>
            </button>
            <button
              className={`brapa-tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
              onClick={() => { setActiveTab('rules'); playClick(); }}
              role="tab"
              aria-selected={activeTab === 'rules'}
            >
              <FlashIcon size={15} />
              <span>{language === 'pt' ? 'Sintaxe & Transições' : 'Syntax & Transitions'}</span>
            </button>
            <button
              className={`brapa-tab-btn ${activeTab === 'tips' ? 'active' : ''}`}
              onClick={() => { setActiveTab('tips'); playClick(); }}
              role="tab"
              aria-selected={activeTab === 'tips'}
            >
              <LightbulbIcon size={15} />
              <span>{language === 'pt' ? 'Dicas de Produção' : 'Production Tips'}</span>
            </button>
          </div>

          {(activeTab === 'vowels' || activeTab === 'consonants') && (
            <div className="brapa-search-wrap">
              <input
                type="text"
                className="brapa-search-input"
                placeholder={language === 'pt' ? 'Buscar fonema (ex: ax, nasal, ch, rw)...' : 'Search phoneme (e.g. ax, nasal, ch, rw)...'}
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
                  <CloseIcon size={13} />
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
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && copyPhoneme(p.symbol)}
                aria-label={`Copiar fonema ${p.symbol}`}
              >
                <div className="phoneme-card-header">
                  <span className="phoneme-symbol">{p.symbol}</span>
                  <span className="phoneme-ipa">/{p.xSampa}/</span>
                </div>
                <div className="phoneme-card-body">
                  <span className="phoneme-type">{p.type}</span>
                  <p className="phoneme-examples">
                    <strong>{p.exampleWord}</strong> <code>{p.examplePhonetic}</code>
                  </p>
                  <p className="phoneme-desc">{p.regional ? p.regional : (p.notes || '')}</p>
                </div>
                <div className="phoneme-copy-hint">
                  {copiedSymbol === p.symbol ? (
                    <span className="copied-badge">
                      <CheckIcon size={12} />
                      <span>{language === 'pt' ? 'Copiado!' : 'Copied!'}</span>
                    </span>
                  ) : (
                    <span className="copy-icon-label">
                      <CopyIcon size={12} />
                      <span>{language === 'pt' ? 'Copiar símbolo' : 'Copy symbol'}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Syntax & Transitions */}
        {activeTab === 'rules' && (
          <div className="brapa-rules-grid">
            {transitionRules.map((rule) => (
              <div className="brapa-rule-card" key={rule.syntax}>
                <div className="rule-syntax-badge">
                  <code>{rule.syntax}</code>
                </div>
                <h3>{rule.name}</h3>
                <p className="rule-explanation">{rule.explanation}</p>
                <div className="rule-example-box">
                  <span className="example-label">{language === 'pt' ? 'Exemplo:' : 'Example:'}</span>
                  <code>{rule.example}</code>
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
                No padrão BRAPA, o encaixe perfeito das notas de transição <code>[V C]</code> depende do overlap correto da consoante. No OpenUTAU ou UTAU clássico, ajuste o <em>Preutterance</em> para que a consoante comece antes do compasso da nota seguinte.
              </p>
            </div>

            <div className="brapa-tip-card">
              <span className="tip-number">02</span>
              <h3>Vogais Abertas vs. Fechadas ([e] vs [eh], [o] vs [oh])</h3>
              <p>
                Diferenciar <code>[e]</code> (como em <em>você</em>) de <code>[eh]</code> (como em <em>pé</em>), e <code>[o]</code> (como em <em>avô</em>) de <code>[oh]</code> (como em <em>avó</em>) é o segredo para o sotaque autêntico e natural do português brasileiro.
              </p>
            </div>

            <div className="brapa-tip-card">
              <span className="tip-number">03</span>
              <h3>Sotaques Regionais no BRAPA ([x], [rh], [rw])</h3>
              <p>
                O BRAPA suporta variações regionais brasileiras autênticas: <code>[x]</code> para o chiado carioca (<em>partir</em> <code>[p a x ch i x]</code>) e <code>[rh]</code> / <code>[rw]</code> para o R retroflexo caipira do Centro-Sul (<em>carne</em> <code>[k a rh n i]</code>).
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
