import React, { useEffect, useState } from 'react';

import {Provider} from '@clayui/core';
import {ClaySelect} from '@clayui/form';

import '@clayui/css/lib/css/atlas.css';

import ObjectAdminService from './services/ObjectAdminService';
import LiferayGraphRenderer from './LiferayGraphRenderer';
import LiferayGraphBuilderTreeView from './LiferayGraphBuilderTreeView';

function LiferayGraph(props) {
  
  const [objectDefinitions, setObjectDefinitions] = useState([]);
  const [selectedObjectDefinition, setSelectedObjectDefinition] = useState();
  const [selectedValueFields, setSelectedValueFields] = useState([]);
  const [selectedCategoryFields, setSelectedCategoryFields] = useState([]);
  const [selectedFilterFields, setSelectedFilterFields] = useState([]);
  const [graphType, setGraphType] = useState("Line");
  const [configuration, setConfiguration] = useState({
    values: [],
    categories: [],
    filters: [],
  });
  
  useEffect(() => {
    if (!selectedObjectDefinition || !selectedObjectDefinition.objectFields) return;
    
    const getFieldWithType = (id) => {
      const field = selectedObjectDefinition.objectFields.find(field => field.id == id);
    
      if (!field) return null;
    
      return {
        field: field.businessType === "PICKLIST" ? `${field.name}.name` : field.name,
        type: field.businessType,
      };
    };
      
    setConfiguration({
      values: selectedValueFields
        .map(field => getFieldWithType(field.id))
        .filter(Boolean), // Supprime les éventuels `null`
  
      categories: selectedCategoryFields
        .map(field => getFieldWithType(field.id))
        .filter(Boolean),
  
      filters: selectedFilterFields
        .map(field => getFieldWithType(field.id))
        .filter(Boolean),
    });
  
  }, [selectedValueFields, selectedCategoryFields, selectedFilterFields, selectedObjectDefinition]);


  useEffect(() => {

    ObjectAdminService.getObjectDefinitions(props.baseURL).then(data => {
      setObjectDefinitions(data);
    });

  }, [props]);

  const handleSelectObjectDefinition = ({target : {value}}) => {
    const objectDefinitionId = value;
    ObjectAdminService.getObjectDefinition(props.baseURL, objectDefinitionId).then(data => {
      setSelectedObjectDefinition(data);
      setSelectedValueFields([]);
      setSelectedCategoryFields([]);
      setSelectedFilterFields([]);
    });
  }

  return (
    <>
      <Provider spritemap={props.spriteMap}>
        <ClaySelect 
            aria-label="Select Label"
            id="mySelectId"
            onChange={handleSelectObjectDefinition}>
          <ClaySelect.Option
            key=""
            label=""
            value=""
          />
          {objectDefinitions.map((item) => (
            <ClaySelect.Option
              key={item.id}
              label={item.name}
              value={item.id}
            />
          ))}
        </ClaySelect>
      </Provider>
      {(selectedObjectDefinition !== undefined) && (
        <>

          <LiferayGraphBuilderTreeView 
            datasetFields={selectedObjectDefinition.objectFields}
            selectedValueFields={selectedValueFields}
            selectedCategoryFields={selectedCategoryFields}
            selectedFilterFields={selectedFilterFields}            
            setSelectedValueFields={setSelectedValueFields}
            setSelectedCategoryFields={setSelectedCategoryFields}
            setSelectedFilterFields={setSelectedFilterFields}
            >
          </LiferayGraphBuilderTreeView>

          {configuration.values.length > 0 && configuration.categories.length > 0 && (

            <LiferayGraphRenderer 
              baseURL={props.baseURL}
              objectDefinition={selectedObjectDefinition}
              configuration={configuration}
              graphType={graphType}
            >
            </LiferayGraphRenderer>

          )}

        </>
      )}
    </>
  );

}

export default LiferayGraph;