
CREATE PROCEDURE [dbo].[mission_symbols_sel]
(
    @ms_id int=NULL
   ,@ms_classification_code char(1)=NULL
   ,@user_id int
	
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt nvarchar(max)

set @stmt = 'SELECT * FROM dbo.mission_symbols WHERE 1=1';

  IF isnull(@ms_id,0) <> 0
	 SET @stmt = @stmt + ' AND ms_id=' + cast(@ms_id as varchar(20));

  IF @ms_classification_code IS NOT NULL
	 SET @stmt = @stmt + ' AND ms_classification_code=''' + @ms_classification_code + ''''
	  
  SET @stmt = @stmt + ' ORDER BY ms_description'; 

  EXEC(@stmt);
	 	
END


