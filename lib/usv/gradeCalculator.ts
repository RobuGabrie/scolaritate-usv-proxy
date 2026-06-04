import type { Grade } from "./types";

export interface GradeStats {
  mediaEcts: number;
  mediaAritmetica: number;
  crediteTotal: number;
  creditePromovate: number;
  promovate: number;
  nepromovate: number;
  inAsteptare: number;
  total: number;
}

export interface SimulationSubject {
  titlu: string;
  credite: number;
  notaNecesara: number;
}

export interface SimulationResult {
  possible: boolean;
  targetMedia: number;
  currentContrib: number;
  remainingSubjects: SimulationSubject[];
  message: string;
}

export interface PendingSubjectCalc {
  titlu: string;
  credite: number;
  hypothetical: number | null;
  notaNecesara: number | null;
}

export interface HypotheticalSimResult {
  possible: boolean;
  targetMedia: number;
  uniformMinimum: number | null;
  pendingSubjects: PendingSubjectCalc[];
  message: string;
  allSet: boolean;
}

function parseFloat2(s: string): number {
  const n = parseFloat(s.replace(",", "."));
  return isNaN(n) ? 0 : n;
}

export function calcStats(grades: Grade[]): GradeStats {
  let sumNotaCredite = 0;
  let sumCreditePromovate = 0;
  let crediteTotal = 0;
  let sumNota = 0;
  let countNota = 0;
  let promovate = 0;
  let nepromovate = 0;
  let inAsteptare = 0;

  for (const g of grades) {
    const nota = parseFloat2(g.notaFinala);
    const credite = parseFloat2(g.credite);

    if (g.notaFinala === "" || nota === 0) {
      inAsteptare++;
      continue;
    }

    sumNota += nota;
    countNota++;

    if (nota >= 5) {
      promovate++;
      sumNotaCredite += nota * credite;
      sumCreditePromovate += credite;
      crediteTotal += credite;
    } else {
      nepromovate++;
      crediteTotal += credite;
    }
  }

  const mediaEcts = sumCreditePromovate > 0 ? sumNotaCredite / sumCreditePromovate : 0;
  const mediaAritmetica = countNota > 0 ? sumNota / countNota : 0;

  return {
    mediaEcts,
    mediaAritmetica,
    crediteTotal,
    creditePromovate: sumCreditePromovate,
    promovate,
    nepromovate,
    inAsteptare,
    total: grades.length,
  };
}

export function simulateGrades(
  allGrades: Grade[],
  targetMedia: number
): SimulationResult {
  const graded = allGrades.filter((g) => g.notaFinala && parseFloat2(g.notaFinala) >= 5);
  const pending = allGrades.filter((g) => !g.notaFinala || parseFloat2(g.notaFinala) === 0);

  // Current contribution: sum(nota * credite) for already-graded subjects
  let currentSum = 0;
  let currentCredite = 0;
  for (const g of graded) {
    const nota = parseFloat2(g.notaFinala);
    const credite = parseFloat2(g.credite);
    currentSum += nota * credite;
    currentCredite += credite;
  }

  const pendingCredite = pending.reduce((acc, g) => acc + parseFloat2(g.credite), 0);
  const totalCredite = currentCredite + pendingCredite;

  // targetMedia * totalCredite = currentSum + sum(nota_i * credite_i)
  // We need: sum(nota_i * credite_i) = targetMedia * totalCredite - currentSum
  const needed = targetMedia * totalCredite - currentSum;

  if (pending.length === 0) {
    const actual = currentCredite > 0 ? currentSum / currentCredite : 0;
    return {
      possible: actual >= targetMedia,
      targetMedia,
      currentContrib: actual,
      remainingSubjects: [],
      message:
        actual >= targetMedia
          ? `Ai deja media ${actual.toFixed(2)} ≥ ${targetMedia}.`
          : `Nu mai sunt materii în așteptare. Media actuală: ${actual.toFixed(2)}.`,
    };
  }

  if (needed <= 0) {
    return {
      possible: true,
      targetMedia,
      currentContrib: currentCredite > 0 ? currentSum / currentCredite : 0,
      remainingSubjects: pending
        .slice()
        .sort((a, b) => parseFloat2(b.credite) - parseFloat2(a.credite))
        .map((g) => ({
          titlu: g.titlu,
          credite: parseFloat2(g.credite),
          notaNecesara: 5,
        })),
      message: `Ajunge să promovezi toate materiile cu nota 5.`,
    };
  }

  // Uniform minimum grade: the single grade X such that scoring X at every
  // pending subject achieves exactly targetMedia. This is the only internally
  // consistent set of minima — per-subject calculations are interdependent.
  // X = needed / pendingCredite
  const notaUniforma = pendingCredite > 0 ? needed / pendingCredite : 11;
  const possible = notaUniforma <= 10;

  const mesaj = !possible
    ? `Imposibil — chiar și cu 10 la toate nu poți atinge media ${targetMedia.toFixed(1)}.`
    : `Trebuie să iei minim ${notaUniforma.toFixed(2)} la fiecare materie rămasă.`;

  return {
    possible,
    targetMedia,
    currentContrib: currentCredite > 0 ? currentSum / currentCredite : 0,
    remainingSubjects: pending
      .slice()
      .sort((a, b) => parseFloat2(b.credite) - parseFloat2(a.credite))
      .map((g) => ({
        titlu: g.titlu,
        credite: parseFloat2(g.credite),
        notaNecesara: Math.min(10, Math.max(5, notaUniforma)),
      })),
    message: mesaj,
  };
}

export function simulateWithHypotheticals(
  allGrades: Grade[],
  hypotheticals: Record<string, number>,
  targetMedia: number
): HypotheticalSimResult {
  const graded = allGrades.filter((g) => g.notaFinala && parseFloat2(g.notaFinala) >= 5);
  const pending = allGrades
    .filter((g) => !g.notaFinala || parseFloat2(g.notaFinala) === 0)
    .slice()
    .sort((a, b) => parseFloat2(b.credite) - parseFloat2(a.credite));

  let gradedSum = 0;
  let gradedCredite = 0;
  for (const g of graded) {
    gradedSum += parseFloat2(g.notaFinala) * parseFloat2(g.credite);
    gradedCredite += parseFloat2(g.credite);
  }

  if (pending.length === 0) {
    const actual = gradedCredite > 0 ? gradedSum / gradedCredite : 0;
    return {
      possible: actual >= targetMedia,
      targetMedia,
      uniformMinimum: null,
      pendingSubjects: [],
      message:
        actual >= targetMedia
          ? `Ai deja media ${actual.toFixed(2)} ≥ ${targetMedia.toFixed(1)}.`
          : `Nu mai sunt materii în așteptare. Media actuală: ${actual.toFixed(2)}.`,
      allSet: true,
    };
  }

  const withHypo = pending.filter((g) => hypotheticals[g.titlu] !== undefined);
  const withoutHypo = pending.filter((g) => hypotheticals[g.titlu] === undefined);

  let hypoSum = 0;
  let hypoCredite = 0;
  for (const g of withHypo) {
    hypoSum += hypotheticals[g.titlu] * parseFloat2(g.credite);
    hypoCredite += parseFloat2(g.credite);
  }

  const unsetCredite = withoutHypo.reduce((acc, g) => acc + parseFloat2(g.credite), 0);
  const totalCredite = gradedCredite + hypoCredite + unsetCredite;

  // All pending subjects have hypotheticals — project final average
  if (withoutHypo.length === 0) {
    const projected = (gradedSum + hypoSum) / (gradedCredite + hypoCredite);
    const possible = projected >= targetMedia;
    return {
      possible,
      targetMedia,
      uniformMinimum: null,
      pendingSubjects: pending.map((g) => ({
        titlu: g.titlu,
        credite: parseFloat2(g.credite),
        hypothetical: hypotheticals[g.titlu],
        notaNecesara: null,
      })),
      message: possible
        ? `Cu notele introduse vei obține media ${projected.toFixed(2)} ≥ ${targetMedia.toFixed(1)}.`
        : `Cu notele introduse vei obține media ${projected.toFixed(2)} — sub ținta de ${targetMedia.toFixed(1)}.`,
      allSet: true,
    };
  }

  const needed = targetMedia * totalCredite - gradedSum - hypoSum;

  if (needed <= 0) {
    return {
      possible: true,
      targetMedia,
      uniformMinimum: 5,
      pendingSubjects: pending.map((g) => ({
        titlu: g.titlu,
        credite: parseFloat2(g.credite),
        hypothetical: hypotheticals[g.titlu] ?? null,
        notaNecesara: hypotheticals[g.titlu] !== undefined ? null : 5,
      })),
      message: `Ajunge să promovezi materiile rămase cu nota minimă 5.`,
      allSet: false,
    };
  }

  const uniformMinimum = unsetCredite > 0 ? needed / unsetCredite : 11;
  const possible = uniformMinimum <= 10;

  return {
    possible,
    targetMedia,
    uniformMinimum: possible ? uniformMinimum : null,
    pendingSubjects: pending.map((g) => ({
      titlu: g.titlu,
      credite: parseFloat2(g.credite),
      hypothetical: hypotheticals[g.titlu] ?? null,
      notaNecesara: hypotheticals[g.titlu] !== undefined ? null : (possible ? uniformMinimum : null),
    })),
    message: !possible
      ? `Imposibil — chiar și cu 10 la materiile rămase nu poți atinge media ${targetMedia.toFixed(1)}.`
      : withHypo.length > 0
        ? `Cu notele introduse, la materiile neselectate trebuie minim ${uniformMinimum.toFixed(2)}.`
        : `La toate materiile rămase trebuie minim ${uniformMinimum.toFixed(2)}.`,
    allSet: false,
  };
}
