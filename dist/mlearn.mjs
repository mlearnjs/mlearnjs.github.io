
export const LinearRegression = async () => {
    const { LinearRegression } = await import('../src/linear-model.mjs');
    return LinearRegression;
};

export const PolynomialRegression = async () => {
    const { PolynomialRegression } = await import('../src/linear-model.mjs');
    return PolynomialRegression;
};

export const GaussianNB = async () => {
    const { GaussianNB } = await import('../src/naive-bayes.mjs');
    return GaussianNB;
};

export const LabelEncoder = async () => {
    const { LabelEncoder } = await import('../src/preprocessing.mjs');
    return LabelEncoder;
};

export const trainTestSplit = async () => {
    const { trainTestSplit } = await import('../src/model-selection.mjs');
    return trainTestSplit;
};

export const joinArrays = async () => {
    const { joinArrays } = await import('../src/model-selection.mjs');
    return joinArrays;
};

export const zip = async () => {
    const { zip } = await import('../src/model-selection.mjs');
    return zip;
};

export const accuracyScore = async () => {
    const { accuracyScore } = await import('../src/metrics.mjs');
    return accuracyScore;
};


/*
export { LinearRegression } from '../src/linear-model.mjs';
export { GaussianNB } from '../src/naive-bayes.mjs';
export { LabelEncoder } from '../src/preprocessing.mjs?v=12345';
export { trainTestSplit, joinArrays, zip } from '../src/model-selection.mjs';
*/