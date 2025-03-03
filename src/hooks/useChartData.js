import { useMemo } from "react";

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

const getFormattedValue = (value, type) => {
    if (type === "date") {
        const dateValue = new Date(value);
        return `${dateValue.getFullYear()}-${(dateValue.getMonth() + 1).toString().padStart(2, "0")}`;
    } else {
        return value;
    }
};

const formatDate = (items, locale) => {
    
    return items.map(item => {
        const date = new Date(item);

        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString(locale);
        }

        return item;
    });
}

export function useChartData(dataPoints, configuration, locale) {
    return useMemo(() => {
        if (!dataPoints.length) return { labels: [], datasets: [] };

        const groupedData = {};

        const xKey = configuration.categories[0];
        const categoryKeys = configuration.categories.slice(1);
        const valueKeys = configuration.values;

        dataPoints.forEach((item) => {
            const formattedXValue = getFormattedValue(getNestedValue(item, xKey.field), xKey.type);

            const categoryLabels = categoryKeys.map(cat => getNestedValue(item, cat.field) || "N/A");
            const categoryPath = categoryLabels.join(" - ");

            if (!groupedData[formattedXValue]) {
                groupedData[formattedXValue] = {};
            }

            valueKeys.forEach((valueKey) => {
                const value = getNestedValue(item, valueKey.field) || 0;
                const datasetLabel = `${categoryPath} - ${valueKey.label[locale.replace("-", "_")]}`;

                if (!groupedData[formattedXValue][datasetLabel]) {
                    groupedData[formattedXValue][datasetLabel] = 0;
                }

                groupedData[formattedXValue][datasetLabel] = value;
            });
        });

        const labels = Object.keys(groupedData).sort();
        const datasetLabels = [...new Set(
            Object.values(groupedData).flatMap(obj => Object.keys(obj))
        )];

        const datasets = datasetLabels.map((label) => {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);

            return {
                label,
                backgroundColor: `rgba(${r}, ${g}, ${b}, 0.6)`,
                borderColor: `rgb(${r}, ${g}, ${b})`,
                borderWidth: 2,
                data: labels.map((month) => groupedData[month][label] || 0),
            };
        });

        const formattedLabels = formatDate(labels, locale);

        return { labels: formattedLabels, datasets: datasets };
    }, [dataPoints, configuration]);
}
