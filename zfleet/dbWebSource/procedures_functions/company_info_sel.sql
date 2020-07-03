
CREATE procedure [dbo].[company_info_sel](
   @registration_code nvarchar(50) = null
  ,@company_code nvarchar(50) = null
  ,@user_id INT = null
)
as
BEGIN
	DECLARE @stmt		VARCHAR(4000);
		SET @stmt = 'SELECT * FROM dbo.company_info WHERE 1=1 ';

	IF @registration_code <> '' 
		SET @stmt = @stmt + ' AND registration_code=' + CAST(@registration_code AS VARCHAR);

	IF @company_code <> ''
		SET @stmt = @stmt + ' AND company_code'+ @company_code;

	set @stmt = @stmt + ' order by registration_code';
	exec(@stmt);
END;
