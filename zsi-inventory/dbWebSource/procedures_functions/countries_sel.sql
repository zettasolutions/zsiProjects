


CREATE PROCEDURE [dbo].[countries_sel]
(
     @user_id INT = NULL
	,@search_val nvarchar(100)=null
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.countries WHERE 1=1 ';

    IF ISNULL(@search_val,'')<>''
       set @stmt = @stmt + ' AND country_name like ''%' + @search_val  + '%'' or country_code like ''%' + @search_val  + '%'' or country_sname like ''%' + @search_val  + '%'''

	exec(@stmt);
 END;


