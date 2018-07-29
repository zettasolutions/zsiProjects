


CREATE PROCEDURE [dbo].[members_sel]  
(  
    @player_id varchar(50) = NULL  
   ,@is_confirmed varchar(1)='Y' 
   ,@is_active varchar(1)='Y'  
)  
AS  
BEGIN  
  SET NOCOUNT ON
  DECLARE @stmt           VARCHAR(4000);  
  DECLARE @order          VARCHAR(4000);  

  SET @stmt = 'SELECT * FROM dbo.members WHERE is_confirmed = ''' + @is_confirmed + ''' AND is_active=''' + @is_active + ''''  
  
  IF ISNULL(@player_id,'') <>''  
  BEGIN  
      SET @stmt = @stmt + ' AND player_id = ''' + @player_id + '''';   
  END  

  SET @stmt = @stmt + ' ORDER BY member_name ';
  EXEC(@stmt);  
END;  
