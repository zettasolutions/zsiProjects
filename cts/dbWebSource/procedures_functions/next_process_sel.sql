CREATE PROCEDURE [dbo].[next_process_sel]
(
   @process_id int
)
AS
BEGIN
   SELECT * FROM dbo.process_statuses WHERE process_id=@process_id;
END


