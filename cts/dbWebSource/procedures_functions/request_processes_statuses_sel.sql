


CREATE PROCEDURE [dbo].[request_processes_statuses_sel]
(
   @request_id INT=NULL
  ,@process_id INT=NULL
  ,@user_id int
)
AS

BEGIN
   SET NOCOUNT ON
   DECLARE @client_id INT
   SELECT @client_id=client_id FROM dbo.users WHERE user_id=@user_id;
   IF ISNULL(@request_id,0) =0
      SELECT * FROM dbo.process_statuses_v where is_default='Y' and client_id=@client_id;
   ELSE
      SELECT * FROM dbo.process_statuses_v where process_id = @process_id and process_id IN
	  (SELECT process_id FROM dbo.user_role_processes_v WHERE app_user_id=@user_id);
     
END;








