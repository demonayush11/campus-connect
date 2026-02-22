/**
 * yearHelper.js — Academic year utilities (frontend)
 *
 * academicYear is computed DYNAMICALLY from admissionYear + current date.
 * It is never stored in the DB, so it auto-advances every July
 * without any backend change.
 */

/**
 * Convert an academicYear number (1–4) to its ordinal label.
 * @param {number|null|undefined} n
 * @returns {string}
 */
export function yearLabel(n) {
    switch (n) {
        case 1: return '1st Year';
        case 2: return '2nd Year';
        case 3: return '3rd Year';
        case 4: return '4th Year';
        default: return '';
    }
}

/**
 * Client-side preview — mirrors the backend logic exactly.
 * Used only for the "live hint" on the signup form; the backend
 * always wins on the actual value.
 *
 * @param {string} email
 * @returns {number|null}  1–4 or null if email is invalid/out of range
 */
export function previewAcademicYear(email) {
    const match = (email || '').trim().match(/^(\d{2})\d+@kiit\.ac\.in$/i);
    if (!match) return null;

    const admissionYear = 2000 + parseInt(match[1], 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed

    const ay = currentMonth >= 7
        ? currentYear - admissionYear + 1
        : currentYear - admissionYear;

    return (ay >= 1 && ay <= 4) ? ay : null;
}
