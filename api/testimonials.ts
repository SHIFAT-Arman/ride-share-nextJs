import api from "@/lib/axios";

export type Testimonial = {
  id: string;
  name: string;
  designation: string;
  testimonial: string;
  avatar: string;
  createdAt: string;
};

export type TestimonialInput = {
  name: string;
  designation: string;
  testimonial: string;
  avatar: string;
};

export const testimonialsApi = {
  list: () => api.get<Testimonial[]>("/testimonials"),
  create: (data: TestimonialInput) =>
    api.post<Testimonial>("/testimonials", data),
  update: (id: string, data: Partial<TestimonialInput>) =>
    api.patch<Testimonial>(`/testimonials/${id}`, data),
  remove: (id: string) => api.delete(`/testimonials/${id}`),
};
