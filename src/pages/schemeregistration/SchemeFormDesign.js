import React, { useState,useEffect  }  from 'react'
import { useForm } from "react-hook-form";
import { useParams,useNavigate } from 'react-router-dom';
import { useFormData } from './FormDataContext';
export default function SchemeFormDesign() {

  const navigate = useNavigate();

  const { schemeId } = useParams(); // Access the schemeId from the URL parameters
  //const { schemeId } = useParams('1849'); // Access the schemeId from the URL parameters


  const { setFormData } = useFormData();

 // State to store dynamically added form fields

 const [textFields, setTextFields] = useState([]);  // For text fields
 const [dateFields, setDateFields] = useState([]);  // For Date fields
 const [customDropdowns, setCustomDropdowns] = useState([]); // For custom dropdowns




  
    //const [documentSchemesHtml, setDocumentSchemesHtml] = useState();
    const [requiredOptions, setRequiredOptions] = useState('');

    const [selectedRequired, setSelectedRequired] = useState({}); // Track selected "required" values

    const [APIHtmloptions, setAPIHtmlOptions] = useState([]);  //API Feild
    const [selectedApi, setSelectedApi] = useState({});  // Track selected API values
    const [APIDropdowns, setAPIDropdowns] = useState([]); // For prefill dropdowns

    const [formFields, setDocFields] = useState([]); // Start with an empty array
    const [documentSchemesHtml, setDocumentSchemesHtml] = useState();
    const [selectedDocuments, setSelectedDocuments] = useState([]); // Track selected document values

    const [prefillDropdowns, setprefillDropdowns] = useState([]); // For prefill dropdowns
    const [prefillOptions, setPrefillOptions] = useState();// For prefill dropdowns
    const [selectedPrefill, setSelectedPrefill] = useState([]);  // Track selected prefill values
    const [selectedprefillRequired, setSelectedprefillRequired] = useState({}); // Track selected required values

    const [loading, setLoading] = useState(false); // Loader state


//draft mode
    const [apiDraftData, setDraftApiData] = useState([]);
    
  // State to track if data is fetched
  //const [dataFetched, setDataFetched] = useState(false);

    // Fetch the document scheme data on page load
    useEffect(() => {
      const fetchDocumentScheme = async () => {
        try {
          setLoading(true); // Show loader
          const response = await fetch('http://localhost:8096/api/getDocumentscheme');
          const data = await response.text(); // Get response as text (HTML)
              // setPrefillOptions(requiredprefilldata);
        const parser1 = new DOMParser();
        const doc1 = parser1.parseFromString(data, 'text/html');
        const optionsdoc = Array.from(doc1.querySelectorAll('option')).map(option => {
       //   const valueParts = option.value.split('~'); // Split the value by '~'
          return {
                        value: option.value,
            //value_id: valueParts[0],  // Extract the first part as value_id
            title: option.title,
            text: option.textContent,
          };
        });
       
          setDocumentSchemesHtml(optionsdoc);

          // If you have requiredOptions API data, you can fetch it as well
        // Assuming there is another endpoint for the required options
         const requiredResponse = await fetch('http://localhost:8096/api/getRequiredList');
         const requiredData = await requiredResponse.text()
         setRequiredOptions(requiredData);


         const Responseprefill = await fetch('http://localhost:8096/api/getPrefilledList');
         const requiredprefilldata = await Responseprefill.text()
        // setPrefillOptions(requiredprefilldata);
        const parser = new DOMParser();
        const doc = parser.parseFromString(requiredprefilldata, 'text/html');
        const options = Array.from(doc.querySelectorAll('option')).map(option => {
          const valueParts = option.value.split('~'); // Split the value by '~'
          return {
            value: option.value,
            value_id: valueParts[0],  // Extract the first part as value_id
            title: option.title,
            text: option.textContent,
          };
        });
        setPrefillOptions(options); // Store as an array of objects



         const Responseapi = await fetch('http://localhost:8096/api/getAPIFeildList');
         const apidata = await Responseapi.text()
         setAPIHtmlOptions(apidata);


         //form structure from draft mode
         const url = 'http://localhost:8096/api/getComponnetList';
    
         const requestData = {
          schemeid: schemeId,
        };

        // Sending POST request with JSON data
      const formstructureapi = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Pass the request data as a JSON string
      });
      console.log("okok");
      // Check if response is ok
      if (!formstructureapi.ok) {
        throw new Error('Failed to fetch form structure');
      }else{

      // Parse the response
      const draftdata = await formstructureapi.json(); // Parse the JSON response
      console.log(draftdata);
         setDraftApiData(draftdata);
         addDraftField(draftdata); // Automatically add fields from the response

    }

    setLoading(false); // Hide loader after request completes
        } catch (error) {
          console.error('Error fetching document schemes:', error);
          setLoading(false); // Hide loader after request completes
        }
      };
      
      fetchDocumentScheme();
    }, []);



// Simple Loader Component
const Loader = () => (
  <div style={{
    display: 'flex',          // Enable flexbox
    justifyContent: 'center', // Center horizontally
    alignItems: 'center',     // Center vertically
    height: '50vh',          // Full viewport height (optional)
    padding: '20px'
  }}>
    <div className="spinner" style={{
      width: '50px',
      height: '50px',
      border: '6px solid rgba(0, 0, 0, 0.1)',
      borderTop: '6px solid #007bff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite, pulse 1.5s ease-in-out infinite'
    }}></div>

    {/* Spinner Animation */}
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
        @keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}
    `}</style>
  </div>
);





    //Draft Handling




 // Handle adding a text field based on API data
 const addDraftField = (data) => {
  data.forEach((field) => {
    //console.log(field.field_type);
    if (field.field_type === 'textbox') {
      const parsedFieldJson = JSON.parse(field.field_json);
      const textboxDetails = JSON.parse(parsedFieldJson.textbox_json_array)[0];

 // Determine the selected data type based on num_valid
 let dataType = 'Alphanumeric'; // Default to Alphanumeric
 if (textboxDetails.num_valid === '2') {
   dataType = 'Numeric';
 } else if (textboxDetails.num_valid === '3') {
   dataType = 'Decimal';
 }

      setTextFields((prevFields) => [
        ...prevFields,
        {
          //id: Date.now(), // Unique key for each field
          id: field.sl_no,
         // label: textboxDetails.label,
          value: textboxDetails.label, // Initial empty value
          isChecked: textboxDetails.required === '1', // Initially, the checkbox state is unchecked
          selectedDataType: dataType, // Default data type
         maxLength: textboxDetails.maximum_length,
          minlength:'1',
          feild_type:'textbox',
        
        },
      ]);
    }else if(field.field_type === 'Dropdown'){
      const parsedFieldJson = JSON.parse(field.field_json);
      const dropdownDetails = parsedFieldJson.dropdown_json_array[0];

      setCustomDropdowns((prevDropdowns) => [
        ...prevDropdowns,
        {
          id: field.sl_no, // Unique key for each dropdown
          //label: '',
          label: dropdownDetails.label, // Initial empty value
          isChecked: dropdownDetails.required === '1',
          feild_type:'Dropdown',
          options: dropdownDetails.option_counter.map((option, index) => ({
            //id: index,
            value: option[`option_value${index}`],
            description: option[`option_name${index}`],
          }))
        },
      ]);


    }else if(field.field_type === 'APILIST'){

      const parsedFieldJson = JSON.parse(field.field_json);
      const apiJsonArray  = JSON.parse(parsedFieldJson.api_json_array)[0];
     setAPIDropdowns((prevFields) =>[
      ...prevFields,
      {
        id: field.sl_no, // Unique key for each field set
        feild_type:'APILIST',
        APIHtmloptions:'<option value="'+apiJsonArray.api_type+'">'+apiJsonArray.label+'</option>',//<option value="option2">Option 2</option>',
      },
    ]);
      
    }else if(field.field_type === 'datefield'){
      const parsedFieldJson = JSON.parse(field.field_json);
      const dateDetails = JSON.parse(parsedFieldJson.datefield_json_array)[0];

      setDateFields((prevFields) => [
        ...prevFields,
        {
          id: field.sl_no, // Unique key for each field
          feild_type:'datefield',
          isChecked: dateDetails.required === '1', // Checkbox state
          value: dateDetails.label, // Initial empty value
        },
      ]);

    }else if(field.field_type === 'prefilled'){
     
      // Add a new doc field on button click
   
      setprefillDropdowns((prevFields) =>[
        ...prevFields,
        {
          id:  field.sl_no, // Unique key for each field set
          selecteditem:  field.field_id,
          feild_type:'prefilled',
          selectedrequiredType: 'YES',
          prefillOptions,
          requiredOptions,
        },
      ]);
 

     
    }else if(field.field_type === 'document'){

  // Add a new doc field on button click

    setDocFields((prevFields) =>[
      ...prevFields,
      {
        id: field.sl_no, // Unique key for each field set
        selecteddoc:  field.document_id,
        feild_type:'document',
        selectedrequireddoc:field.is_required,
        documentSchemesHtml,
        requiredOptions,
      },
    ]);



    }
  });
};




// Add a custom dropdown with a label, value, and description
const addCustomDropdown = () => {
  setCustomDropdowns((prevDropdowns) => [
    ...prevDropdowns,
    {
      id: Date.now(), // Unique key for each dropdown
      label: '',
      feild_type:'Dropdown',
      isChecked:false,
      options: [{ value: '', description: '' }],
    },
  ]);
};

// Add an option to a specific custom dropdown
const addDropdownOption = (id) => {
  setCustomDropdowns((prevDropdowns) =>
    prevDropdowns.map((dropdown) =>
      dropdown.id === id
        ? {
            ...dropdown,
            options: [...dropdown.options, { value: '', description: '' }],
          }
        : dropdown
    )
  );
};
  // Handle input change for custom dropdown fields (label, value, description)
  const handleDropdownChange = (id, index, field, value) => {
    setCustomDropdowns((prevDropdowns) =>
      prevDropdowns.map((dropdown) =>
        dropdown.id === id
          ? {
              ...dropdown,
              options: dropdown.options.map((option, i) =>
                i === index ? { ...option, [field]: value } : option
              ),
            }
          : dropdown
      )
    );
  };

  // Add a new doc field on button click
  const addDocField = () => {
    setDocFields((prevFields) =>[
      ...prevFields,
      {
        id: Date.now(), // Unique key for each field set
        selecteddoc: '', // Initialize selecteddoc
        selectedrequireddoc: 'Y', // Default to 'Y'
        feild_type:'document',
        documentSchemesHtml,
        requiredOptions,
      },
    ]);
  };


  // Add a new text field with a label
  const addTextField = () => {
    setTextFields((prevFields) => [
      ...prevFields,
      {
        id: Date.now(), // Unique key for each field
        value: '',  // Initially empty value
        isChecked: false, // Checkbox state
        selectedDataType: 'Numeric', // Default dropdown value
        feild_type:'textbox',
        maxLength:'',
      },
    ]);
  };


    // Add a new Date field with a label
    const addDateField = () => {
      setDateFields((prevFields) => [
        ...prevFields,
        {
          id: Date.now(), // Unique key for each field
          isChecked: false, // Checkbox state
          feild_type:'datefield',
        },
      ]);
    };



     // Function to remove a text field
  const removeTextField = (id) => {
    setTextFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

       // Function to remove a text field
       const removeDateField = (id) => {
        setDateFields((prevFields) => prevFields.filter((field) => field.id !== id));
      };

  // Function to handle checkbox change
  const handleCheckboxChange = (id) => {
    setTextFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, isChecked: !field.isChecked } : field
      )
    );
  };
    // Function to handle checkbox change
    const handlecustomCheckboxChange = (id) => {
      setCustomDropdowns((prevDropdowns) =>
        prevDropdowns.map((dropdown) =>
          dropdown.id === id ? { ...dropdown, isChecked: !dropdown.isChecked } : dropdown
        )
      );
    };

    // Function to handle checkbox change
    const handleDateCheckboxChange = (id) => {
      setDateFields((prevFields) =>
        prevFields.map((field) =>
          field.id === id ? { ...field, isChecked: !field.isChecked } : field
        )
      );
    };

   // Function to handle dropdown change (DataType selection)
   const handleDataTypeChange = (id, value) => {
    setTextFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, selectedDataType: value } : field
      )
    );
  };
 // Function to remove a custom dropdown
 const removeCustomDropdown = (id) => {
  setCustomDropdowns((prevDropdowns) =>
    prevDropdowns.filter((dropdown) => dropdown.id !== id)
  );
};
        // Don't render the form fields until data is fetched
  //if (!dataFetched) {
  //  return <div>Loading...</div>;
 // }

 const handleTextChange = (id, value) => {
  setTextFields((prevFields) =>
    prevFields.map((field) =>
      field.id === id ? { ...field, value: value } : field
    )
  );
};
 
const handleMaxLengthChange = (id, value) => {
  setTextFields((prevFields) =>
    prevFields.map((field) =>
      field.id === id ? { ...field, maxLength: value } : field
    )
  );
};

const handleMinLengthChange = (id, value) => {
  setTextFields((prevFields) =>
    prevFields.map((field) =>
      field.id === id ? { ...field, minlength: value } : field
    )
  );
};
  //const handleDocumentChange = (fieldId, value) => {
  //  setSelectedDocuments(prev => ({ ...prev, [fieldId]: value }));
 // };
 const handleDocumentChange = (fieldId, selectedValue) => {
  setDocFields((prevFields) =>
    prevFields.map((field) =>
      field.id === fieldId ? { ...field, selecteddoc: selectedValue } : field
    )
  );
};

  const handledateChange = (id, value) => {
    setDateFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, value: value } : field
      )
    );
  };
  const handleRequiredChange = (fieldId, value) => {
    setSelectedRequired(prev => ({ ...prev, [fieldId]: value }));
  };
  const handlePrefillRequiredChange = (fieldId, selectedValue) => {

    setprefillDropdowns((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, selectedrequiredType: selectedValue } : field
      )
    );
  };
  //const handledocRequiredChange = (fieldId, value) => {
  //  setSelectedRequired(prev => ({ ...prev, [fieldId]: value }));
  //};
  const handledocRequiredChange = (fieldId, selectedValue) => {
    setDocFields((prevFields) =>
      prevFields.map((field) =>
        field.id === fieldId ? { ...field, selectedrequireddoc: selectedValue } : field
      )
    );
  };
  const removeFormField = (id) => {
    setDocFields(prevFields => prevFields.filter(field => field.id !== id));
    // Also remove the corresponding selected values for that field
    const newSelectedDocuments = { ...selectedDocuments };
    delete newSelectedDocuments[id];
    setSelectedDocuments(newSelectedDocuments);

    const newSelectedRequired = { ...selectedRequired };
    delete newSelectedRequired[id];
    setSelectedRequired(newSelectedRequired);
  };


    // Add a new doc field on button click
    const addprefillField = () => {
      setprefillDropdowns((prevFields) =>[
        ...prevFields,
        {
          id: Date.now(), // Unique key for each field set
          feild_type:'prefilled',
          selectedrequiredType: 'NO',
          prefillOptions,
          requiredOptions,
        },
      ]);
    };
	
	       // Function to remove a perfill field
    const removeprefilledField = (id) => {
      setprefillDropdowns((prevFields) => prevFields.filter(field => field.id !== id));
    };
    const handlePrefillChange = (fieldId, selectedValue) => {
      setprefillDropdowns((prevFields) =>
        prevFields.map((field) =>
          field.id === fieldId ? { ...field, selecteditem: selectedValue } : field
        )
      ); 
    };
  //const handlePrefillChange = (fieldId, value) => {
  //  setSelectedPrefill((prev) => ({ ...prev, [fieldId]: value }));
  //};

  const handleprefillRequiredChange = (fieldId, value) => {
    setSelectedprefillRequired((prev) => ({ ...prev, [fieldId]: value }));
  };

  const removePrefillField = (id) => {
    setprefillDropdowns((prevFields) => prevFields.filter((field) => field.id !== id));
    // Also remove the corresponding selected values for that field
    const newSelectedPrefill = { ...selectedPrefill };
    delete newSelectedPrefill[id];
    setSelectedPrefill(newSelectedPrefill);

    const newSelectedRequired = { ...selectedRequired };
    delete newSelectedRequired[id];
    setSelectedRequired(newSelectedRequired);
  };

  	
	    // Add a new doc field on button click
      const addAPIField = () => {
        setAPIDropdowns((prevFields) =>[
          ...prevFields,
          {
            id: Date.now(), // Unique key for each field set
            feild_type:'APILIST',
            APIHtmloptions,
          },
        ]);
      };

  const handleapiChange = (fieldId, value) => {
    setSelectedApi((prev) => ({ ...prev, [fieldId]: value }));
  };

  
  const removeapiField = (id) => {
    setAPIDropdowns((prevFields) => prevFields.filter((field) => field.id !== id));
    // Also remove the corresponding selected values for that field
    const newSelectedApi = { ...selectedApi };
    delete newSelectedApi[id];
    setSelectedApi(newSelectedApi);

  };




  //const handleApiChange = (fieldId, value) => {
 //   setSelectedApi((prev) => ({ ...prev, [fieldId]: value }));
  //};
  const parseAPIOptions = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const options = Array.from(doc.querySelectorAll('option'));
    
    return options.map((option) => (
      <option key={option.value} value={option.value} title={option.title}>
        {option.textContent}
      </option>
    ));
  };



 // Handle Save Button
 const handleSave = async () => {
  try {
   



    const jsonArray = [

         ...textFields,
      ...dateFields,
      ...customDropdowns,
      ...formFields,
      ...prefillDropdowns,
      ...APIDropdowns,
    ];

     // Create a JavaScript object (like a JSON)
 const scheme_json = {
  scheme_id: schemeId,
  scheme_spec_info:jsonArray
};
  
    console.log('JSON Array:', scheme_json);
    //http://localhost:8096/api/saveDocuments

    const response = await fetch('http://localhost:8096/api/postSchemeSpec_info', {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
      },
     body: JSON.stringify(scheme_json),
    });

    if (!response.ok) {
     throw new Error('Failed to save data');
    }

 

   // Set data in context before navigating
     setFormData(jsonArray);

       // Navigate to preview page
       navigate(`/SchemePreview/${schemeId}`);


  //console.log('APIDropdowns:', APIDropdowns);
  // Function to create JSON array

    


   // const result = await response.json();
   // console.log('Document:', formFields);
   // console.log('TextBox:', textFields);
   // console.log('Date:', dateFields);
   // console.log('customdropdown:', customDropdowns);
   // console.log('prefillDropdowns:', prefillDropdowns);
   // console.log('APIDropdowns:', APIDropdowns);
  
    alert('Data saved successfully!');
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to save data');
  }
};
// Check if the form has any data
//data gfdgde
const isFormNotEmpty = () => {
  return (
    textFields.length > 0 ||
    dateFields.length > 0 ||
    customDropdowns.length > 0 ||
    formFields.length > 0 ||
    prefillDropdowns.length > 0 ||
    APIDropdowns.length > 0
  );
};

  return (
    <div className="container mt-4">
<div className="row mb-2 ">  <h4>Scheme Specific Information</h4>   <p>Scheme ID: {schemeId}</p>  </div>

  {/* Buttons */}
  <div  className="row mb-4 b-2 p-4 border border-warning border-3 rounded-pill" id="scheme_specific_buttons">
<div className="d-flex justify-content-between ">
<h4>Components</h4> 
          <button className="btn btn-success" type="button" onClick={addTextField} >  
            <span className="plus">Text Field</span>
          </button>
  

        
        <button className="btn btn-success" type="button" onClick={addDocField}>
          <span className="plus">Document Field</span> 
        </button>
      
    
        <button className="btn btn-success" type="button" onClick={addDateField}>
          <span className="plus">Date Field</span> 
        </button>
      
      
          <button className="btn btn-success" type="button" onClick={addCustomDropdown}>
            <span className="plus">Custom Dropdown</span>
          </button>
      
          <button className="btn btn-success" type="button" onClick={addprefillField}>
            <span className="plus">Prefilled List</span>
          </button>

          <button className="btn btn-success" type="button" onClick={addAPIField}>
            <span className="plus">API Feild</span>

          </button>
      </div></div>
{/* Show loader if loading */}
{loading && <Loader />}
<div class="row mb-4 " id="scheme_specific_doc_field">
{formFields.map((field, index) => (
                                                     

                                                          
          <div key={field.id} className="col-md-10" id="scheme_specific_doc_field">
            <div className="input-group">
              <div className="form-group col-md-5  required">
                <label htmlFor="scheme" className="control-label">Document List :</label>
                <select
                  className="form-select mr-sm-2"
                  id={`scheme_specific_doc_${field.id}`}
                  name="scheme_specific_doc"
                  value={field.selecteddoc}
                  onChange={(e) => handleDocumentChange(field.id, e.target.value)}
                  required=""
                >
                   
          {documentSchemesHtml.map((option) => (
            <option key={option.value} value={option.value} title={option.title}   >
              {option.text}
            </option>
          ))}
                </select>
              </div> 
              <div className="form-group col-md-1  required"></div>
              <div className="form-group col-md-5 required " style={{ marginRight: "2px" }}>
                <label htmlFor="scheme" className="control-label">Required :</label>
                <select
                  className="form-select mr-sm-2"
                  id={`is_required_${field.id}`}
                  name="is_required"
                  value={field.selectedrequireddoc}
                onChange={(e) => handledocRequiredChange(field.id, e.target.value)}
                  required=""
                >
                   <option value="Y">YES</option>
                   <option value="N">NO</option>
                </select>
              </div>
               {/* Render the '-' button only for fields after the first one */}
              
              <div className="input-group-btn col-md-1 mt-4" >
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => removeFormField(field.id)}
                >
                  <span className="minus">-</span>
                </button>
              </div>
         
            </div>
          </div>
        ))}
    

    </div>
     


          {/* Render Text Fields */}
 
     <div className="row mb-4 " id="scheme_specific_text_field ">


        {textFields.map((field) => (
          <div key={field.id} className="col-md-12">
            <div className="input-group">
              <div className="form-group col-md-2  " style={{ marginRight: "4px" }}>
                <label htmlFor={`text_field_${field.id}`} className="control-label  ">
                  Text Field:
                </label>
                <input
                  type="text"
                  className="form-control  "
                  id={`text_field_${field.id}`}
                  name={`text_field_${field.id}`}
                  value={field.value || ''}  // Make sure to bind the state value here
                  onChange={(e) => handleTextChange(field.id, e.target.value)}  // Handle input change
                  required
                />

              </div> 
              <div className="form-group col-md-2 " style={{ marginRight: "4px" }}>
                <label htmlFor={`text_field_${field.id}`} className="control-label">
                  Max Length:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`text_max_field_${field.id}`}
                  name={`text_field_${field.id}`}
                  value={field.maxLength || ''}  // Make sure to bind the state value here
                  onChange={(e) => handleMaxLengthChange(field.id, e.target.value)} // Add this
                  required
                />

              </div>
              <div className="form-group col-md-2" style={{ marginRight: "4px" }}>
                <label htmlFor={`text_field_${field.id}`} className="control-label">
                  Min Length:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`text_field_${field.id}`}
                  name={`text_field_${field.id}`}
                  value={field.minlength || ''}  // Make sure to bind the state value here
                  onChange={(e) => handleMinLengthChange(field.id, e.target.value)} // Add this
                  required
                />

              </div>
              {/* Checkbox: Required */}
              <div className="form-group col-md-2 p-4" >
                <label htmlFor={`checkbox_${field.id}`} className="control-label">
                  Required:
                </label>
                &nbsp;&nbsp;&nbsp;
                <input
                
                  type="checkbox"
                  id={`checkbox_${field.id}`}
                  name={`checkbox_${field.id}`}
                  checked={field.isChecked}
                  onChange={() => handleCheckboxChange(field.id)}
                />
              </div>

               {/* Dropdown: DataType */}
               <div className="form-group col-md-2" style={{ marginRight: "4px" }}>
                <label htmlFor={`data_type_${field.id}`} className="control-label">
                  DataType:
                </label>
                <select
                  id={`data_type_${field.id}`}
                  name={`data_type_${field.id}`}
                  className="form-select"
                  value={field.selectedDataType}
                  onChange={(e) => handleDataTypeChange(field.id, e.target.value)}
                >
                  <option value="Numeric">Numeric</option>
                  <option value="Alphanumeric">Alphanumeric</option>
                  <option value="Decimal">Decimal</option>
                </select>
              </div>

                  {/* Remove Button */}
              <div className="input-group-btn col-md-1 mt-4" >
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => removeTextField(field.id)}
                >
                  <span className="minus">-</span>
                </button>
              </div>
            </div>
          </div>
        ))}

     
      </div>

      {/* Render Date Fields */}
      <div className="row mb-4" id="scheme_specific_date_field">
        {dateFields.map((field) => (
          <div key={field.id} className="col-md-12">
            <div className="input-group">
              <div className="form-group col-md-2  " style={{ marginRight: "4px" }}>
                <label htmlFor={`text_field_${field.id}`} className="control-label  ">
                  Date Field Label :
                </label>
                <input
                  type="text"
                  className="form-control  "
                  id={`text_field_${field.id}`}
                  name={`text_field_${field.id}`}
                  value={field.value || ''}  // Make sure to bind the state value here
                  onChange={(e) => handledateChange(field.id, e.target.value)}
                  required
                />

              </div> 
            
            
              {/* Checkbox: Required */}
              <div className="form-group col-md-2 p-4 " >
                <label htmlFor={`checkbox_${field.id}`} className="control-label">
                  Required:
                </label>
                &nbsp;&nbsp;&nbsp;
                <input
                  type="checkbox"
                  id={`checkbox_${field.id}`}
                  name={`checkbox_${field.id}`}
                  checked={field.isChecked}
                  onChange={() => handleDateCheckboxChange(field.id)}
                />
              </div>


                  {/* Remove Button */}
              <div className="input-group-btn col-md-1 mt-4" >
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => removeDateField(field.id)}
                >
                  <span className="minus">-</span>
                </button>
              </div>
            </div>
          </div>
        ))}

     
      </div>
       {/* Render Custom Dropdowns */}
       <div className="row mb-4" id="scheme_specific_custom_dropdown">
        {customDropdowns.map((dropdown) => (
          <div key={dropdown.id} className="  col-md-12 mt-3">
          
              <div className="input-group col-md-12">
                <label htmlFor={`dropdown_label_${dropdown.id}`} className="control-label mt-3">
                  Dropdown Label:
                </label>
                &nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  className="form-control "
                  id={`dropdown_label_${dropdown.id}`}
                  value={dropdown.label}
                  onChange={(e) =>
                    setCustomDropdowns((prev) =>
                      prev.map((d) =>
                        d.id === dropdown.id ? { ...d, label: e.target.value } : d
                      )
                    )
                  }
                  placeholder="Enter Dropdown Label"
                />
              &nbsp;&nbsp;&nbsp;
                   {/* Checkbox: Required */}
                  
                <label htmlFor={`checkbox_${dropdown.id}`} className="control-label p-2">
                  Required:
                </label>
                &nbsp;&nbsp;&nbsp;
                <input
                
                  type="checkbox"
                  id={`checkbox_${dropdown.id}`}
                  name={`checkbox_${dropdown.id}`}
                  checked={dropdown.isChecked}
                  onChange={() => handlecustomCheckboxChange(dropdown.id)}
                

                />
              &nbsp;&nbsp;&nbsp;
                <button
                  className="btn btn-success"
                  type="button"
                  onClick={() => addDropdownOption(dropdown.id)}
                >
                  <span className="plus">+</span> 
                </button>
              
                &nbsp;&nbsp;&nbsp;
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => removeCustomDropdown(dropdown.id)}
                >
                  <span className="minus">-</span>
                </button>
             
              </div>
              {dropdown.options.map((option, index) => (
                
                <div key={index} className=" col-md-12">
                  <div className="row col-md-12">
                  <div class="col-md-6"></div>
                  <div class=" col-md-6">
                  <div className="input-group  col-md-6  ">
                    <label htmlFor={`value_${dropdown.id}_${index}`} className="control-label mt-3">
                      Option Name:
                    </label>
                    &nbsp;&nbsp;&nbsp;
                    <input
                      type="text"
                      className="form-control"
                      id={`value_${dropdown.id}_${index}`}
                      value={option.value}
                      onChange={(e) =>
                        handleDropdownChange(dropdown.id, index, 'value', e.target.value)
                      }
                      placeholder="Enter Name"
                    />
                    
                    &nbsp;&nbsp;&nbsp;
                  
                    <label htmlFor={`desc_${dropdown.id}_${index}`} className="control-label mt-3">
                      Option Value:
                    </label>
                    &nbsp;&nbsp;&nbsp;
                    <input
                      type="text"
                      className="form-control"
                      id={`desc_${dropdown.id}_${index}`}
                      value={option.description}
                      onChange={(e) =>
                        handleDropdownChange(dropdown.id, index, 'description', e.target.value)
                      }
                      placeholder="Enter Value"
                    />
                  </div>
                  </div></div>
                </div>
              ))}
        
            
          </div>
        ))}
      </div>

      <div class="row mb-4 " id="scheme_specific_prefill_field">
{prefillDropdowns.map((field, index) => (
                                                     

                                                          
          <div key={field.id} className="col-md-10" id="scheme_specific_prefill_field">
            <div className="input-group">
              <div className="form-group col-md-5  required">
                <label htmlFor="scheme" className="control-label">Prefilled List :</label>
                <select
                  className="form-select mr-sm-2"
                  id={`scheme_specific_prefill_${field.id}`}
                  name="scheme_specific_prefill"
                  value={field.selecteditem}
                  onChange={(e) => handlePrefillChange(field.id, e.target.value)}
                  required=""
                >
                  <option value="">Select an option</option>
          {prefillOptions.map((option) => (
            <option key={option.value} value={option.value_id} title={option.title}   >
              {option.text}
            </option>
          ))}
                </select>
              </div> 
              <div className="form-group col-md-1  required"></div>
              <div className="form-group col-md-5 required " style={{ marginRight: "2px" }}>
                <label htmlFor="scheme" className="control-label">Required :</label>
                <select
                  className="form-select mr-sm-2"
                  id={`is_required_${field.id}`}
                  name="is_required"
                  value={field.selectedrequiredType}
                  onChange={(e) => handlePrefillRequiredChange(field.id, e.target.value)}
                  required=""
                >
                 <option value="YES">YES</option>
                 <option value="NO">NO</option>
                </select>
              </div>
               {/* Render the '-' button only for fields after the first one */}
             
              <div className="input-group-btn col-md-1 mt-4" >
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => removePrefillField(field.id)}
                >
                  <span className="minus">-</span>
                </button>
              </div>
         
            </div>
          </div>
        ))}
    

    </div>
    <div class="row mb-4 " id="scheme_specific_api_field">
{APIDropdowns.map((field, index) => (
                                                     

                                                          
          <div key={field.id} className="col-md-10" id="scheme_specific_api_field">
            <div className="input-group">
              <div className="form-group col-md-5  required">
                <label htmlFor="scheme" className="control-label">API List :</label>
                <select
                  className="form-select mr-sm-2"
                  id={`scheme_specific_api_${field.id}`}
                  name="scheme_specific_api"
                  value={selectedApi[field.id] || ''}
                  onChange={(e) => handleapiChange(field.id, e.target.value)}
                  required=""
                >
                 
                  {parseAPIOptions(field.APIHtmloptions)}
                </select>
              </div> 
              
               {/* Render the '-' button only for fields after the first one */}
               &nbsp;&nbsp;&nbsp;
              <div className="input-group-btn col-md-1 mt-4" >
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => removeapiField(field.id)}
                >
                  <span className="minus">-</span>
                </button>
              </div>
         
            </div>
          </div>
        ))}
    

    </div>
   
    
        <div className="d-flex justify-content-center mb-3">
        {isFormNotEmpty() && (
        <button className="btn btn-success" type="button" onClick={handleSave} disabled={loading} style={{ padding: '10px 20px' }}>
        {loading ? 'Please wait...' : 'Save & Preview'}
        </button>
        )}
        </div>
 
    </div>
  );
}
