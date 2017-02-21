

CREATE PROCEDURE [dbo].[page_process_action_next_sel]
(
	@page_id INT = NULL,
    @page_process_id  INT = NULL,
	@user_id INT = null
)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @sql VARCHAR(MAX)

	SET @sql =  'SELECT ' +
		' page_process_id, process_desc' +
		' FROM [dbo].[page_processes]' +
		' WHERE 1 = 1' +
		' AND [page_id] = ' + CAST(@page_id AS NVARCHAR(20))
	
	IF @page_process_id IS NOT NULL
		SET @sql = @sql + ' AND [page_process_id] <>  ' + CAST(@page_process_id AS NVARCHAR(20)); 

	SET @sql = @sql + ' ORDER BY [process_desc] '
	EXEC(@sql);
END