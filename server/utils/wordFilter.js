/**
 * Filtro de palavras proibidas — ZeroBerto Top 10 Blog
 * 
 * Censura palavras ofensivas substituindo por asteriscos (*).
 * O filtro é case-insensitive e lida com variações comuns
 * (acentos, números substituindo letras, etc.)
 */

// Lista de palavras proibidas (português brasileiro)
const FORBIDDEN_WORDS = [
  // Palavrões comuns
  'caralho', 'porra', 'merda', 'foda', 'fodase', 'fodasse',
  'puta', 'putaria', 'putinha', 'putona',
  'viado', 'viada', 'viadinho', 'viadinha',
  'buceta', 'boceta', 'xoxota', 'xereca',
  'cacete', 'caceta',
  'cu ', 'cuzão', 'cuzao',
  'arrombado', 'arrombada',
  'desgraçado', 'desgraçada', 'desgracado', 'desgracada',
  'filho da puta', 'filha da puta', 'fdp',
  'vai tomar no cu', 'vtmnc', 'vtnc',
  'pqp', 'puta que pariu',
  'otario', 'otária', 'otário', 'otaria',
  'babaca', 'imbecil', 'idiota',
  'corno', 'corna', 'cornudo', 'cornuda',
  'piranha',
  'vagabundo', 'vagabunda',
  'safado', 'safada',
  'nojento', 'nojenta',
  'lixo humano',

  // Ofensas graves
  'retardado', 'retardada',

  // Slurs / ofensas de ódio
  'macaco', 'macaca',
  'nazista', 'hitler',

  // Variações com números (leetspeak)
  'c4ralho', 'p0rra', 'm3rda',
  'put4', 'buc3ta',

  // Inglês comum
  'fuck', 'fucking', 'shit', 'bitch', 'asshole',
  'dick', 'pussy', 'bastard', 'damn',
  'nigger', 'nigga', 'faggot',
]

/**
 * Normaliza texto para comparação:
 * - Converte para lowercase
 * - Remove acentos
 * - Substitui números comuns por letras (leetspeak)
 */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/4/g, 'a')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
}

/**
 * Censura palavras proibidas no texto.
 * Substitui cada letra da palavra por *.
 * Preserva a primeira letra para contexto (ex: "p****").
 * 
 * @param {string} text - Texto a ser filtrado
 * @returns {{ filtered: string, hasForbidden: boolean }} - Texto censurado e flag
 */
export function censorText(text) {
  if (!text || typeof text !== 'string') {
    return { filtered: text, hasForbidden: false }
  }

  const normalizedText = normalize(text)
  let result = text
  let hasForbidden = false

  // Ordena por comprimento descendente para evitar substituições parciais
  const sortedWords = [...FORBIDDEN_WORDS].sort((a, b) => b.length - a.length)

  for (const word of sortedWords) {
    const normalizedWord = normalize(word)
    
    // Cria regex com word boundaries para evitar falsos positivos
    // Usa a versão normalizada para busca, mas substitui no texto original
    const escapedWord = normalizedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi')
    
    // Encontra matches no texto normalizado
    let match
    const normalizedCopy = normalize(result)
    const matches = []
    
    while ((match = regex.exec(normalizedCopy)) !== null) {
      matches.push({ index: match.index, length: match[0].length })
    }

    // Aplica censura de trás para frente (para preservar índices)
    for (let i = matches.length - 1; i >= 0; i--) {
      const { index, length } = matches[i]
      const original = result.substring(index, index + length)
      
      // Preserva a primeira letra + asteriscos
      const censored = original[0] + '*'.repeat(length - 1)
      
      result = result.substring(0, index) + censored + result.substring(index + length)
      hasForbidden = true
    }
  }

  return { filtered: result, hasForbidden }
}

/**
 * Verifica se o texto contém palavras proibidas (sem censurar).
 * 
 * @param {string} text - Texto a verificar
 * @returns {boolean}
 */
export function hasForbiddenWords(text) {
  return censorText(text).hasForbidden
}

/**
 * Retorna a lista de palavras proibidas encontradas no texto.
 * 
 * @param {string} text - Texto a verificar
 * @returns {string[]} - Array de palavras encontradas
 */
export function findForbiddenWords(text) {
  if (!text || typeof text !== 'string') return []

  const normalizedText = normalize(text)
  const found = []

  for (const word of FORBIDDEN_WORDS) {
    const normalizedWord = normalize(word)
    const escapedWord = normalizedWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'i')

    if (regex.test(normalizedText)) {
      found.push(word)
    }
  }

  return found
}

export default { censorText, hasForbiddenWords, findForbiddenWords }
