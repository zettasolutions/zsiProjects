CREATE PROCEDURE [dbo].[excel_upload_sel]
AS
BEGIN
   SELECT *, load_name as text, temp_table +','+ excel_column_range +',' + isnull(redirect_page,'') as value FROM excel_uploads order by seq_no
END;



