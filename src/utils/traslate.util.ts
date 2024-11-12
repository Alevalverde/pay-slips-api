export function formatDataModel(data: string) {
  const [model, categories] = Object.entries(data)[0];
  const [emotion, category] = Object.entries(categories)[0];
  return `${translationModel[model]}: ${emotion} (${category}%)`;
}

export const translationModel: Record<string, string> = {
  basicEmotions: 'Emociones',
  concerns: 'Preocupaciones',
  attributes: 'Atributos',
  socialClimate: 'Clima Social',
  voterMotivationalNetwork: 'Motivación del voto',
  feelings: 'Sentimientos',
};
