CREATE PROCEDURE [dbo].[pages_sel]
(
   @page_id  INT = null
   ,@page_name  varchar(50) = null
   ,@search_page_name  varchar(200) = null
)
AS
BEGIN
  IF @page_id IS NOT NULL  
	 SELECT * FROM pages_v WHERE page_id = @page_id; 
  IF @page_name IS NOT NULL  
      SELECT * FROM pages_v WHERE page_name = @page_name ORDER BY page_name; 
  IF @search_page_name IS NOT NULL
      SELECT * FROM pages_v WHERE page_name like '%'  + @search_page_name +  '%' ORDER BY page_name; 
  ELSE
       SELECT * FROM pages_v ORDER BY page_name;
      
END
 
