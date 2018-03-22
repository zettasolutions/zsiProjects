CREATE PROCEDURE [dbo].[oracle_compile_scripts_response_upd](
        @developer				VARCHAR(10)                      
	   ,@response			    VARCHAR(MAX)
)
AS 
BEGIN
    SET NOCOUNT ON 

		update dbo.oracle_compile_scripts 
			set  
				 [source] = ''
				 ,response = @response 
				 ,response_counter = isnull(response_counter,0) + 1
			where developer=@developer	

END 

