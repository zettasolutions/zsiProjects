
CREATE procedure [dbo].[company_info_for_developer_sel](
	@user_id INT = null
)
as
BEGIN
	SET NOCOUNT ON
	DECLARE @stmt		VARCHAR(4000); 
		SET @stmt = 'SELECT * FROM dbo.company_info_v WHERE 1=1'; 
	exec(@stmt);
END;
