export const contentTypes = [
  { value: "intro", label: "Intro", singular: true },
  { value: "project", label: "Projects" },
  { value: "certificate", label: "Certificates" },
  { value: "course", label: "Courses" },
  { value: "education", label: "Education" },
  { value: "about", label: "About", singular: true },
  { value: "contact", label: "Contact", singular: true }
];

export const typeLabels = Object.fromEntries(contentTypes.map((item) => [item.value, item.label]));
