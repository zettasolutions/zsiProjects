

-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 25, 2016 4:37 PM
-- Description:	Supply source select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[supply_sources_sel]
(
    @supply_source_id  INT = null
   ,@is_local          char(1) = null
   ,@is_active         char(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.supply_sources WHERE is_active=''' + @is_active + ''''


  IF @supply_source_id IS NOT NULL  
	 SET @stmt = @stmt + ' AND supply_source_id = ' + cast(@supply_source_id as varchar(20)); 
 
  IF @is_local IS NOT NULL
     SET @stmt = @stmt + ' AND is_local =''' + @is_local + '''';

  SET @stmt = @stmt + ' ORDER BY supply_source_name '; 
  exec(@stmt);		
END


