
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 25, 2016 3:40 PM
-- Description:	Dealer select all or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[dealers_sel]
(
    @dealer_id  INT = null
   ,@is_local          char(1) = null
   ,@is_active         char(1) = 'Y'
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
  SET @stmt = 'SELECT * FROM dbo.dealers WHERE is_active=''' + @is_active + ''''


  IF @dealer_id IS NOT NULL  
	 SET @stmt = @stmt + ' AND dealer_id = ' + cast(@dealer_id as varchar(20)); 
 
  IF @is_local IS NOT NULL
     SET @stmt = @stmt + ' AND is_local =''' + @is_local + '''';

  SET @stmt = @stmt + ' ORDER BY dealer_name '; 
  exec(@stmt);	
END

