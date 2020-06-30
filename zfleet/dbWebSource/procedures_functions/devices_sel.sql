
CREATE PROCEDURE [dbo].[devices_sel]
(
    @company_code nvarchar(50)
   ,@is_active	VARCHAR(1)='Y'
   ,@user_id int
)
AS
BEGIN
	SET NOCOUNT ON
		SELECT * FROM dbo.devices where company_code = @company_code and is_active = @is_active
END


