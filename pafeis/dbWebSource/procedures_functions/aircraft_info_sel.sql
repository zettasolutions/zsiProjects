
CREATE PROCEDURE [dbo].[aircraft_info_sel]
(
    @aircraft_info_id  INT = null
   ,@squadron_id       INT = NULL
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
SET @stmt = 'SELECT * FROM dbo.aircraft_info_v WHERE 1=1 '

IF ISNULL(@squadron_id,0) <> 0 
   SET @stmt = @stmt + ' AND squadron_id = ' + cast(@squadron_id as varchar(20)) 

IF ISNULL(@aircraft_info_id,0) <> 0  
	 SET @stmt = @stmt + ' AND aircraft_info_id = ' + cast(@aircraft_info_id as varchar(20)) 
  
 SET @stmt = @stmt + ' ORDER BY aircraft_name '; 
	
END


