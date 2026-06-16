/**
 * Filtro de palavras proibidas — Frontend
 * Censura e detecção em tempo real.
 */

const FORBIDDEN_WORDS = [
  // Frases compostas primeiro (mais longas)
  'vai tomar no cu', 'filho da puta', 'filha da puta',
  'puta que pariu', 'lixo humano',
  // Palavrões comuns
  'caralho', 'porra', 'merda', 'foda', 'fodase', 'fodasse',
  'puta', 'putaria', 'putinha', 'putona',
  'viado', 'viada', 'viadinho', 'viadinha',
  'buceta', 'boceta', 'xoxota', 'xereca',
  'cacete', 'caceta',
  'cuzão', 'cuzao',
  'arrombado', 'arrombada',
  'desgraçado', 'desgraçada', 'desgracado', 'desgracada',
  'fdp', 'vtmnc', 'vtnc', 'pqp',
  'otario', 'otária', 'otário', 'otaria',
  'babaca', 'imbecil', 'idiota',
  'corno', 'corna', 'cornudo', 'cornuda',
  'piranha',
  'vagabundo', 'vagabunda',
  'safado', 'safada',
  'nojento', 'nojenta',
  'retardado', 'retardada',
  'macaco', 'macaca',
  'nazista', 'hitler',
  // Leetspeak
  'c4ralho', 'p0rra', 'm3rda', 'put4', 'buc3ta',
  // Inglês
  'fuck', 'fucking', 'shit', 'bitch', 'asshole',
  'dick', 'pussy', 'bastard',
  'nigger', 'nigga', 'faggot',
]

// Sort by length descending to match longer phrases first
const SORTED_WORDS = [...FORBIDDEN_WORDS].sort((a, b) => b.length - a.length)

/**
 * Builds a character class that matches a letter and its accented/leet variants.
 */
function charPattern(ch) {
  const map = {
    'a': '[aáàâãä4@AÁÀÂÃÄå]',
    'e': '[eéèêë3EÉÈÊËε]',
    'i': '[iíìîï1!IÍÌÎÏl]',
    'o': '[oóòôõö0OÓÒÔÕÖ]',
    'u': '[uúùûüUÚÙÛÜ]',
    's': '[s5$SŠš]',
    'c': '[cçCÇ]',
    'n': '[nñNÑ]',
  }
  const lower = ch.toLowerCase()
  if (map[lower]) return map[lower]
  if (/[a-z]/i.test(ch)) return `[${ch.toLowerCase()}${ch.toUpperCase()}]`
  if (/[.*+?^${}()|[\]\\]/.test(ch)) return '\\' + ch
  return ch
}

/**
 * Censura palavras proibidas no texto, substituindo por *.
 * Preserva a primeira letra (ex: "merda" → "m****").
 */
export function censorText(text) {
  if (!text || typeof text !== 'string') {
    return { filtered: text, hasForbidden: false }
  }

  let result = text
  let hasForbidden = false

  for (const word of SORTED_WORDS) {
    // Build regex pattern from word characters
    let pattern = ''
    for (const ch of word) {
      pattern += charPattern(ch)
    }

    // Use simple regex without lookbehind for max browser compatibility
    const regex = new RegExp(pattern, 'g')

    result = result.replace(regex, (match) => {
      hasForbidden = true
      if (match.length <= 1) return '*'
      return match[0] + '*'.repeat(match.length - 1)
    })
  }

  return { filtered: result, hasForbidden }
}

/**
 * Verifica se o texto contém palavras proibidas.
 */
export function checkForbiddenWords(text) {
  const { hasForbidden } = censorText(text)
  return { hasForbidden }
}
