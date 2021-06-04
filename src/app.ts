interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(data: Validatable): boolean {
  let isValid = true;
  if (data.required) {
    isValid = isValid && data.value.toString().trim().length > 0;
  }
  if (data.minLength != null && typeof data.value === 'string') {
    isValid = isValid && data.value.trim().length > data.minLength;
  }
  if (data.maxLength != null && typeof data.value === 'string') {
    isValid = isValid && data.value.trim().length < data.maxLength;
  }
  if (data.min != null && typeof data.value === 'number') {
    isValid = isValid && data.value >= data.min;
  }
  if (data.max != null && typeof data.value === 'number') {
    isValid = isValid && data.value <= data.max;
  }
  return isValid;
}

function Autobind(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const newDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFunction = originalMethod.bind(this);
      // let c = target.constructor;
      return boundFunction;
    }
  }
  return newDescriptor;
};

class ProjectItem {
  projectItemTemplate: HTMLTemplateElement;
  projectItemElement: HTMLLIElement;

  constructor() {
    this.projectItemTemplate = document.getElementById("single-project") as HTMLTemplateElement;
    // Clone project item template content and get real project item element
    const importedNode = document.importNode(this.projectItemTemplate.content, true);
    this.projectItemElement = importedNode.firstElementChild as HTMLLIElement;
  }
}

class ProjectList {
  projectListTemplate: HTMLTemplateElement;
  projectSectionElement: HTMLElement;
  projectListElement: HTMLUListElement;
  projectItems: ProjectItem[] = [];

  constructor() {
    this.projectListTemplate = document.getElementById("project-list")! as HTMLTemplateElement;
    // Clone project template
    const importedNode = document.importNode(this.projectListTemplate.content, true);
    // Get project section element
    this.projectSectionElement = importedNode.firstElementChild as HTMLElement;
    // Get real project list element
    this.projectListElement = this.projectSectionElement.querySelector("ul") as HTMLUListElement;
  }

  addProject(item: ProjectItem) {
    this.projectItems.push(item);
  }

  attach(target: HTMLElement) {
    target.appendChild(this.projectSectionElement);
  }
}

class ProjectInput {
  formTemplate: HTMLTemplateElement;
  targetElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  projectList: ProjectList;

  constructor() {
    this.formTemplate = document.getElementById("project-input")! as HTMLTemplateElement;
    this.targetElement = document.getElementById("app")! as HTMLDivElement;

    // Clone form template content and get real form HTML element
    const importedNode = document.importNode(this.formTemplate.content, true);
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input";

    // Get all form input elements
    this.titleInputElement = this.formElement.querySelector("#title")! as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector("#description")! as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector("#people")! as HTMLInputElement;

    // Configure the form submit
    this.configure();

    // Render the form to the DOM
    this.renderForm();

    // Create project list instance
    this.projectList = new ProjectList();
    this.projectList.attach(this.targetElement);
  }

  private configure() {
    this.formElement.addEventListener("submit", this.submitHandler);
  }

  private clearUserInput(): void {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  private getUserInput(): [string, string, number] | void {
    const title: string = this.titleInputElement.value;
    const description: string = this.descriptionInputElement.value;
    const people: number = +this.peopleInputElement.value;

    const titleValidation: Validatable = {
      value: title,
      required: true
    }
    const descriptionValidation: Validatable = {
      value: description,
      required: true,
      minLength: 5
    }
    const peopleValidation: Validatable = {
      value: +people,
      required: true,
      min: 1,
      max: 10
    }

    if (
      !validate(titleValidation) ||
      !validate(descriptionValidation) ||
      !validate(peopleValidation)
    ) {
      alert("Error");
      return;
    }

    return [
      title,
      description,
      people
    ]
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.getUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      // console.log(title, description, people);
      this.clearUserInput();
    }
  }

  private renderForm() {
    this.targetElement.appendChild(this.formElement);
  }
}

const projectInput = new ProjectInput();