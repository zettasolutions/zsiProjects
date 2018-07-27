
CREATE PROCEDURE [dbo].[subscribe_appl_sel]
(
    @client_id int
   ,@user_id int
)
AS
BEGIN
   SELECT * FROM dbo.applications WHERE client_id = @client_id;
END