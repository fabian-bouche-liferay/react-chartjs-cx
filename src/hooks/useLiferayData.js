import { useEffect, useState } from "react";
import { useResource } from "@clayui/data-provider";

export function useLiferayData(baseURL, objectDefinition) {
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);
    const [dataPoints, setDataPoints] = useState([]);

    const { loadMore, resource } = useResource({
        fetch: async (link) => {
            const result = await window.Liferay.Util.fetch(link);
            const json = await result.json();

            setLastPage(json.lastPage);

            return {
            cursor: json.page < json.lastPage
                ? `${baseURL}${objectDefinition.restContextPath}?sort=dateCreated&page=${json.page + 1}`
                : null,
            items: json.items,
            };
        },
        link: `${baseURL}${objectDefinition.restContextPath}?sort=dateCreated&page=1`,
        variables: { limit: 10 },
    });

    useEffect(() => {
        if (resource) {
            setDataPoints((prevData) => [...prevData, ...resource]);
        }
    }, [resource]);

    
    useEffect(() => {
        const interval = setInterval(() => {
            if (loadMore && currentPage < lastPage) {
                loadMore();
                setCurrentPage((prev) => prev + 1);
            } else {
                clearInterval(interval);
            }
        }, 200);
        return () => clearInterval(interval);
    }, [loadMore, currentPage, lastPage]);

    return dataPoints;
}
