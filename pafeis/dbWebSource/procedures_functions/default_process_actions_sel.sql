
CREATE PROCEDURE [dbo].[default_process_actions_sel]
(
   @page_id INT
  ,@role_id INT
)
AS
BEGIN
  SELECT * FROM dbo.page_process_actions_v 
   WHERE page_id=@page_id AND role_id=@role_id
     AND is_default='Y'

END


