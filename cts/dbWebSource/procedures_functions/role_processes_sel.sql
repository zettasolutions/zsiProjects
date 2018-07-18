
CREATE PROCEDURE [dbo].[role_processes_sel]  
(  
    @process_id int = NULL 
   ,@role_id int = null
   ,@user_id int = null
   ,@is_active varchar(1)='Y'  
)  
AS  
BEGIN  
  SET NOCOUNT ON
  DECLARE @stmt           VARCHAR(4000);  
  DECLARE @order          VARCHAR(4000);  

  SET @stmt = 'SELECT role_process_id, process_id, role_id FROM role_processes ' 
  SET @stmt = @stmt + 'UNION SELECT NULL role_process_id, NULL as process_id, role_id FROM roles WHERE 1=1 '
  
  IF ISNULL(@process_id,'') <>''  
  BEGIN  
      SET @stmt = @stmt + ' AND process_id = ' + CAST(@process_id AS VARCHAR(20));   
  END  
  
  IF ISNULL(@role_id,'') <>''  
  BEGIN  
      SET @stmt = @stmt + ' AND role_id = ' + CAST(@role_id AS VARCHAR(20));   
  END  
  
  EXEC(@stmt);  
END;  
  
  



