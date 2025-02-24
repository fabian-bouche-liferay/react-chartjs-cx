import React, { useState, useEffect } from "react";
import { TreeView } from '@clayui/core';

function LiferayGraphBuilderTreeView(props) {
    const [expandedKeys, setExpandedKeys] = useState(new Set(['available', 'values', 'categories', 'filters']));
    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        // 🛠 Extraire tous les IDs sélectionnés
        const selectedIds = new Set([
            ...props.selectedValueFields.map(field => field.id),
            ...props.selectedCategoryFields.map(field => field.id),
            ...props.selectedFilterFields.map(field => field.id),
        ]);

        // 🛠 Filtrer les champs disponibles en excluant ceux déjà sélectionnés
        const availableFields = props.datasetFields
            .filter(field => !selectedIds.has(field.id))
            .map(field => ({
                id: `${field.id}`,
                name: field.name,
            }));

        // 🛠 Mise à jour du TreeData avec les valeurs du parent
        setTreeData([
            {
                id: "available",
                name: "Available",
                children: availableFields,
            },
            {
                id: "values",
                name: "Values",
                children: props.selectedValueFields,
            },
            {
                id: "categories",
                name: "Categories",
                children: props.selectedCategoryFields,
            },
            {
                id: "filters",
                name: "Filters",
                children: props.selectedFilterFields,
            },
        ]);
    }, [
        props.datasetFields,
        props.selectedValueFields,
        props.selectedCategoryFields,
        props.selectedFilterFields,
    ]);

    const handleItemMove = (draggingItem, targetItem, index) => {
        //console.log("Dragging Item:", draggingItem);
        //console.log("Target Item:", targetItem);
        //console.log("Index:", index);
    
        const validTargets = ["available", "values", "categories", "filters"];
        if (!validTargets.includes(targetItem.id)) return;
    
        const updatedTree = [...treeData];
        let draggedNode = null;
    
        updatedTree.forEach((node) => {
            node.children = node.children.filter((child) => {
                if (child.id === draggingItem.cursor.at(-1)) {
                    draggedNode = child;
                    return false;
                }
                return true;
            });
        });
    
        if (draggedNode) {
            const targetNode = updatedTree.find((node) => node.id === targetItem.id);
            if (targetNode) {
                targetNode.children.push(draggedNode);
            }
        }

        const selectedValues = updatedTree.find(node => node.id === "values")?.children || [];
        const selectedCategories = updatedTree.find(node => node.id === "categories")?.children || [];
        const selectedFilters = updatedTree.find(node => node.id === "filters")?.children || [];

        props.setSelectedValueFields(selectedValues);
        props.setSelectedCategoryFields(selectedCategories);
        props.setSelectedFilterFields(selectedFilters);

    };

    return (
        <TreeView
            items={treeData}
            expandedKeys={expandedKeys}
            onExpandedChange={setExpandedKeys}
            nestedKey="children"
            dragAndDrop={true}
            onItemMove={handleItemMove}
        >
            {(item) => (
                <TreeView.Item key={item.id}>
                    <TreeView.ItemStack>{item.name}</TreeView.ItemStack>
                    {item.children && (
                        <TreeView.Group>
                            {item.children.map((child) => (
                                <TreeView.Item key={child.id}>
                                <TreeView.ItemStack>{child.name}</TreeView.ItemStack>
                                </TreeView.Item>
                            ))}
                        </TreeView.Group>
                    )}
                </TreeView.Item>
            )}
        </TreeView>
    );
}

export default LiferayGraphBuilderTreeView;
