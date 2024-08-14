"use strict";
// const url = 'https://backend-ruby-two-32.vercel.app/api/add-flash-card';
const url = 'https://flash-card-api-ashy.vercel.app/api/add-flash-card';
const fakeFlashCards = [
    { title: 'What is React?', answer: 'A JavaScript library for building user interfaces.' },
    { title: 'What is TypeScript?', answer: 'A typed superset of JavaScript that compiles to plain JavaScript.' },
    { title: 'Explain useState in React.', answer: 'useState is a Hook that lets you add state to functional components.' },
    { title: 'What is an interface in TypeScript?', answer: 'An interface defines the shape of an object, describing its structure.' },
    { title: "What does the 'map' function do in JavaScript?", answer: "The 'map' function creates a new array by applying a function to each element of an existing array." },
    { title: 'What is a component in React?', answer: 'A component is a reusable piece of UI that can manage its own state and props.' },
    { title: 'What is Tailwind CSS?', answer: 'A utility-first CSS framework for rapidly building custom designs.' },
    { title: 'What is the purpose of useEffect in React?', answer: 'useEffect lets you perform side effects in function components.' },
    { title: 'What is Prisma?', answer: 'Prisma is an open-source ORM for Node.js and TypeScript that helps developers build faster and type-safe database access.' },
    { title: 'What is the difference between Props and State in React?', answer: 'Props are used to pass data from parent to child components, while state is local data managed within a component.' },
];
for (let i = 0; i < fakeFlashCards.length; i++) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(fakeFlashCards[i]),
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
}
