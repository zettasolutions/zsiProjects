

CREATE PROCEDURE [dbo].[device_terms_sel]
( 
     @user_id INT = NULL 
	,@device_model_id INT = NULL
	,@search_val nvarchar(100)=null
)
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt NVARCHAR(MAX)

 	SET @stmt = 'SELECT * FROM dbo.device_terms WHERE 1=1';

	IF  ISNULL(@device_model_id,0) <> 0
	    SET @stmt = @stmt + ' AND device_model_id ='+ cast(@device_model_id as varchar(20));
	   
	exec(@stmt);
 END;

