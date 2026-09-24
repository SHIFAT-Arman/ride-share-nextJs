import api from "@/lib/axios";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

export type FaqInput = {
  question: string;
  answer: string;
};

export const faqsApi = {
  list: () => api.get<Faq[]>("/faqs"),
  create: (data: FaqInput) => api.post<Faq>("/faqs", data),
  update: (id: string, data: Partial<FaqInput>) =>
    api.patch<Faq>(`/faqs/${id}`, data),
  remove: (id: string) => api.delete(`/faqs/${id}`),
};
