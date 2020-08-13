
CREATE PROCEDURE [dbo].[devices_sel]
(
    @company_id nvarchar(50)
   ,@is_active	VARCHAR(1)='Y'
   ,@user_id int
)
AS
BEGIN
	SET NOCOUNT ON
		SELECT * FROM dbo.devices where company_id = @company_id and is_active = @is_active
END

