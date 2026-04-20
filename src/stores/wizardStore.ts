import { create } from "zustand";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

interface WizardAnswer {
  questionId: string;
  question: string;
  answer: string;
  answerLabel: string;
}

interface WizardState {
  currentStep: WizardStep;
  ideaText: string;
  answers: WizardAnswer[];
  selectedStyle: string;
  projectName: string;
  isGenerating: boolean;
  generationProgress: number;
  generatedProjectId: string | null;
  vision: {
    title: string;
    summary: string;
    pillars: { title: string; description: string; icon: string }[];
    scaleGoal: string;
  } | null;

  setStep: (step: WizardStep) => void;
  setIdeaText: (text: string) => void;
  setVision: (vision: any) => void;
  addAnswer: (answer: WizardAnswer) => void;
  setSelectedStyle: (style: string) => void;
  setProjectName: (name: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  setGeneratedProjectId: (id: string) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1 as WizardStep,
  ideaText: "",
  answers: [] as WizardAnswer[],
  selectedStyle: "saas-modern",
  projectName: "",
  isGenerating: false,
  generationProgress: 0,
  generatedProjectId: null as string | null,
  vision: null as any,
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,
  setStep: (step) => set({ currentStep: step }),
  setIdeaText: (text) => set({ ideaText: text }),
  setVision: (vision) => set({ vision }),
  addAnswer: (answer) =>
    set((state) => ({ answers: [...state.answers, answer] })),
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  setProjectName: (name) => set({ projectName: name }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  setGeneratedProjectId: (id) => set({ generatedProjectId: id }),
  reset: () => set({ ...initialState }),
}));
