// Reveal kini komponen bersama lintas tema -- dipindah ke components/shared.
// File ini tinggal re-export supaya import lama di section-section theme1
// tetap jalan tanpa churn.
export { default } from '../../../shared/Reveal';
export type { RevealVariant } from '../../../shared/Reveal';
