import { formatInTimeZone, toZonedTime } from 'date-fns-tz'

/**
 * Détecte automatiquement le fuseau horaire de la machine
 * @returns Le fuseau horaire détecté (ex: "Europe/Paris", "America/New_York")
 */
export function detectTimezone(): string {
  try {
    // Méthode 1: Utiliser Intl.DateTimeFormat pour détecter le fuseau horaire
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timeZone && timeZone !== 'UTC') {
      return timeZone
    }
    
    // Méthode 2: Fallback - détecter basé sur l'offset
    const offset = new Date().getTimezoneOffset()
    const offsetHours = Math.abs(offset) / 60
    
    // Mapping des offsets vers les fuseaux horaires courants
    const timezoneMap: Record<string, string> = {
      '0': 'UTC',
      '1': 'Europe/London',
      '2': 'Europe/Paris',
      '3': 'Europe/Moscow',
      '4': 'Asia/Dubai',
      '5': 'Asia/Kolkata',
      '6': 'Asia/Bangkok',
      '7': 'Asia/Ho_Chi_Minh',
      '8': 'Asia/Shanghai',
      '9': 'Asia/Tokyo',
      '10': 'Australia/Sydney',
      '11': 'Pacific/Guadalcanal',
      '12': 'Pacific/Auckland',
      '-5': 'America/New_York',
      '-6': 'America/Chicago',
      '-7': 'America/Denver',
      '-8': 'America/Los_Angeles',
      '-9': 'America/Anchorage',
      '-10': 'Pacific/Honolulu'
    }
    
    return timezoneMap[offset] || 'UTC'
  } catch (error) {
    console.warn('Erreur lors de la détection du fuseau horaire:', error)
    return 'UTC'
  }
}

/**
 * Obtient le fuseau horaire actuel (forcé à Suisse/Genève)
 * @returns Le fuseau horaire de Suisse (Europe/Zurich)
 */
export function getCurrentTimezone(): string {
  // Forcer l'utilisation du fuseau horaire de Suisse
  const swissTimezone = 'Europe/Zurich'
  
  // Sauvegarder pour cohérence
  localStorage.setItem('APP_TIMEZONE', swissTimezone)
  return swissTimezone
}

/**
 * Formate une date dans le fuseau horaire local
 * @param date - La date à formater
 * @param format - Le format de sortie (ex: 'dd/MM/yyyy - HH:mm')
 * @returns La date formatée dans le fuseau horaire local
 */
export function formatLocalDate(date: string | Date, format: string = 'dd/MM/yyyy - HH:mm'): string {
  const timezone = getCurrentTimezone()
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return formatInTimeZone(dateObj, timezone, format)
}

/**
 * Convertit une date UTC vers le fuseau horaire local
 * @param utcDate - La date UTC
 * @returns La date dans le fuseau horaire local
 */
export function convertUtcToLocal(utcDate: string | Date): Date {
  const timezone = getCurrentTimezone()
  const dateObj = typeof utcDate === 'string' ? new Date(utcDate) : utcDate
  
  return toZonedTime(dateObj, timezone)
}

/**
 * Convertit une date locale vers UTC
 * @param localDate - La date locale
 * @returns La date en UTC
 */
export function convertLocalToUtc(localDate: Date): Date {
  const timezone = getCurrentTimezone()
  // Pour convertir local vers UTC, on utilise la date locale directement
  return new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000))
}

/**
 * Obtient la date actuelle dans le fuseau horaire local
 * @returns La date actuelle locale
 */
export function getCurrentLocalDate(): Date {
  const timezone = getCurrentTimezone()
  return toZonedTime(new Date(), timezone)
}

/**
 * Formate la date actuelle dans le fuseau horaire local
 * @param format - Le format de sortie
 * @returns La date actuelle formatée
 */
export function getCurrentLocalDateFormatted(format: string = 'dd/MM/yyyy - HH:mm'): string {
  return formatLocalDate(getCurrentLocalDate(), format)
}

/**
 * Obtient l'heure actuelle en minutes depuis minuit (fuseau horaire local)
 * @returns Minutes depuis minuit
 */
export function getCurrentLocalTimeInMinutes(): number {
  const now = getCurrentLocalDate()
  return now.getHours() * 60 + now.getMinutes()
}

/**
 * Vérifie si une heure est encore valide aujourd'hui (pas trop tard)
 * @param maxHour - L'heure maximale (ex: 21 pour 21h00)
 * @returns true si l'heure actuelle est avant maxHour
 */
export function isTodayStillValid(maxHour: number = 21): boolean {
  const currentTime = getCurrentLocalTimeInMinutes()
  return currentTime < maxHour * 60
}

/**
 * Génère les dates disponibles pour les commandes
 * @returns Array des dates disponibles avec labels
 */
export function getAvailableDates(): Array<{ value: string; label: string }> {
  const today = getCurrentLocalDate()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  
  const dates: Array<{ value: string; label: string }> = []
  
  // Vérifier si aujourd'hui est encore valide
  if (isTodayStillValid()) {
    dates.push({
      value: today.toISOString().split('T')[0],
      label: `${today.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })} - Aujourd'hui`,
    })
  }
  
  // Demain est toujours disponible
  dates.push({
    value: tomorrow.toISOString().split('T')[0],
    label: `${tomorrow.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })} - Demain`,
  })
  
  return dates
}

/**
 * Génère les heures disponibles pour une date donnée
 * @param selectedDate - La date sélectionnée
 * @param startHour - Heure de début (défaut: 11)
 * @param endHour - Heure de fin (défaut: 22)
 * @param interval - Intervalle en minutes (défaut: 15)
 * @returns Array des heures disponibles
 */
export function getAvailableTimes(
  selectedDate: string,
  startHour: number = 11,
  endHour: number = 22,
  interval: number = 15
): string[] {
  const times: string[] = []
  const currentTime = getCurrentLocalTimeInMinutes()
  const today = getCurrentLocalDate().toISOString().split('T')[0]
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const timeInMinutes = hour * 60 + minute
      
      // Si c'est aujourd'hui, vérifier que l'heure n'est pas passée
      if (selectedDate === today) {
        if (timeInMinutes > currentTime + 30) { // +30 minutes de marge
          times.push(timeString)
        }
      } else {
        // Si c'est demain ou plus tard, toutes les heures sont disponibles
        times.push(timeString)
      }
    }
  }
  
  return times
}

/**
 * Formate une date et heure pour le payload API
 * @param date - La date (format YYYY-MM-DD)
 * @param time - L'heure (format HH:mm)
 * @returns La date formatée pour l'API
 */
export function formatDateForPayload(date: string, time: string): string {
  const dateObj = new Date(date)
  return `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()} ${time}`
}

/**
 * Initialise le fuseau horaire au démarrage de l'application
 */
export function initializeTimezone(): void {
  const timezone = getCurrentTimezone()
  const now = new Date()
  const localTime = formatLocalDate(now, 'dd/MM/yyyy HH:mm:ss')
}
