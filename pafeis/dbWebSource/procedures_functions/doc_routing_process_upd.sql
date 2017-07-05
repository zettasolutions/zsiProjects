
CREATE PROCEDURE [dbo].[doc_routing_process_upd]
(
   @page_id  INT
  ,@doc_id   INT
  ,@page_process_action_id INT
  ,@user_id  INT
)
AS
BEGIN
  DECLARE @page_process_id int
  DECLARE @is_end_process char(1)='N'

  UPDATE dbo.doc_routings SET page_process_action_id=@page_process_action_id, acted_by = @user_id, acted_date=GETDATE()
   WHERE is_current = 'Y' AND page_id=@page_id and doc_id=@doc_id;

   
   SELECT TOP 1 @is_end_process=is_end_process, @page_process_id=next_process_id  FROM dbo.page_process_actions WHERE page_process_action_id =@page_process_action_id

	IF @is_end_process='Y'
		UPDATE dbo.doc_routings SET is_current = 'N' WHERE page_process_action_id=@page_process_action_id and doc_id=@doc_id;
	ELSE
	IF ISNULL(@page_process_id,0) <> 0 
		BEGIN
			UPDATE dbo.doc_routings SET is_current = 'Y' WHERE page_process_id=@page_process_id and doc_id=@doc_id;
			UPDATE dbo.doc_routings SET is_current = 'N' WHERE page_id=@page_id and doc_id=@doc_id AND page_process_action_id=@page_process_action_id;
		END
END
 

