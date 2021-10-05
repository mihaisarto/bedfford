## How ro run this:

```
docker build --tag bedford .
docker run --publish 5000:5000 --name bedford bedford
```
    

## 
### The problem
Benford's Law. In 1938, Frank Benford published a paper showing the
distribution of the leading digit in many disparate sources of data. In all these sets of data, the
number 1 was the leading digit about 30% of the time. Benford’s law has been found to apply to
population numbers, death rates, lengths of rivers, mathematical distributions given by some
power law, and physical constants like atomic weights and specific heats.
Create a python-based web application (use of tornado or flask is fine) that
1) can ingest the attached example file (census_2009b) and any other flat file with a viable
target column. Note that other columns in user-submitted files may or may not be the same as
the census data file and users are known for submitting files that don't always conform to rigid
expectations. How you deal with files that don't conform to the expectations of the application is
up to you, but should be reasonable and defensible.
2) validates Benford’s assertion based on the '7_2009' column in the supplied file
3) Outputs back to the user a graph of the observed distribution of numbers with an overlay of
the expected distribution of numbers. The output should also inform the user of whether the
observed data matches the expected data distribution.
Stretch challenge: The delivered package should contain a docker file that allows us to docker
run the application and test the functionality directly.
## Server side

Please note that the endpoints are designed with the respect of the stateless approach
https://github.com/mihaisarto/bedford/blob/main/src/main/service.py

The following REST API calls are being defined (that should be a swagger):

- [POST] /upload_data - endpoint used to upload flat file data

      response: {id : 'generatedGUID'}
    
- [GET] /data/`id` - endpoint that returns ingested data in json format. Data validation occurs at this endpoint
    
      response: {
              "columns": [],
              "content": []
          }
        
- [GET] /data/`id`/bedford - endpoint returning the list of the fields/targets that are suitable for bedford problem

- [GET] /data/`id`/bedford/`target` - endpoint returning data in regards with bedford problem for field `target`

        response: {
                "target": target,
                "data_size": 0,
                "digit_distribution": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
            
### Client side
For convenience the following JS APIS have been used:

            - jQuery - jquery-1.12<br>
            - jqWidgets - ver 12.01
 
### Limitations
  - Unable to identity and resolve target fields with Scientific notation
  - TBD

