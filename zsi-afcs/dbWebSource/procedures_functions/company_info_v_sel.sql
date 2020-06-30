CREATE procedure [dbo].[company_info_v_sel](
	@user_id INT = null
)
as
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt		VARCHAR(4000);
	DECLARE @company_id	nvarchar(20)=null;
		select @company_id = company_id FROM dbo.users where user_id=@user_id;
		SET @stmt = 'SELECT * FROM dbo.company_info_v WHERE company_id= ''' + @company_id + ''''; 
	exec(@stmt);
END;