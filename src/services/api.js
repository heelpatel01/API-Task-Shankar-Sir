import axios from 'axios';

const BASE_URL = 'https://json-server-c67opnddza-el.a.run.app';

export const getCategories = () => {
    axios.get(`${BASE_URL}/categories`).then((res) => {
        const categories = res.data.map(categoriesName => categoriesName.name);
        return (["All",...categories]);
    })
}