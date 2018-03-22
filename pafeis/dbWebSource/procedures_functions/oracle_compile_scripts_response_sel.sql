CREATE PROCEDURE [dbo].[oracle_compile_scripts_response_sel](
        @developer				VARCHAR(10)                      
)
AS 
BEGIN
    SET NOCOUNT ON 
	select * from dbo.oracle_compile_scripts where developer=@developer	
END 

