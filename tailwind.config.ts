import { frostedThemePlugin } from "@whop/react/tailwind";

export default {
    theme: {
        extend: {
            colors: {
                orange: {
                    500: '#FF6243', // Whop Orange
                    600: '#E5583C',
                }
            }
        }
    },
    plugins: [frostedThemePlugin()]
};
