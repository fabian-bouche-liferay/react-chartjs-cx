class ObjectAdminService {

  static getObjectDefinitions(baseURL) {

    return window.Liferay.Util.fetch(baseURL + "/o/graphql", {
      method: "POST",
      body: `{
        "query": "{
          objectAdmin_v1_0 {
            objectDefinitions {
              items {
                id
                name
                restContextPath
              }
            }
          }
        }"
      }`,
      headers: {
          "Content-Type": "application/json"
      }
    }).then(response => {

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      return response.json();

    }).then(data => {
      return data.data.objectAdmin_v1_0.objectDefinitions.items;
    });

  }

  static getObjectDefinition(baseURL, objectDefinitionId) {

    return window.Liferay.Util.fetch(baseURL + "/o/graphql", {
      method: "POST",
      body: `{
        "query": "{
          objectAdmin_v1_0 {
            objectDefinition(objectDefinitionId: ${objectDefinitionId}) {
              id
              name
              restContextPath
              objectFields {
                id
                name
                businessType
                listTypeDefinitionId
              }
            }
          }
        }"
      }`,
      headers: {
          "Content-Type": "application/json"
      }
    }).then(response => {

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        return response.json();

    }).then(data => {
        return data.data.objectAdmin_v1_0.objectDefinition;
    });


    

  }

}

export default ObjectAdminService;