CREATE PROCEDURE [dbo].[plans_sel]
(
    @plan_id  INT = null
   ,@user_id INT = NULL
   ,@search_val nvarchar(100)=null
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.plans WHERE 1=1 ';

	IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND plan_code like ''%' + @search_val  + '%'' or plan_desc like ''%' + @search_val + '%'''
	
	IF  ISNULL(@plan_id,0) <> 0
	    SET @stmt = @stmt + ' AND plan_id ='+ cast(@plan_id as varchar(20));

	exec(@stmt);
 END;


