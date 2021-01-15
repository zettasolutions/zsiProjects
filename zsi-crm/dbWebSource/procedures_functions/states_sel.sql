


CREATE PROCEDURE [dbo].[states_sel]
(
    @country_id  INT = null
   ,@user_id INT = NULL
   ,@search_val nvarchar(100)=null
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.states WHERE 1=1 ';

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND state_name like ''%' + @search_val  + '%'' or state_code like ''%' + @search_val  + '%'' or state_sname like ''%' + @search_val  + '%'''
	
	IF  ISNULL(@country_id,0) <> 0
	    SET @stmt = @stmt + ' AND country_id ='+ cast(@country_id as varchar(20));

	exec(@stmt);
 END;


