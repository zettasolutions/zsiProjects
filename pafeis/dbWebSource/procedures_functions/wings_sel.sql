
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- UPDATED      G. Tabinas Jr. 
-- Create date: October 19, 2016 6:22PM
-- Description:	Wing select all or by wing records.
-- =============================================
CREATE PROCEDURE [dbo].[wings_sel]
(
    @wing_id  INT = null
   ,@is_active NCHAR(1) = 'Y'
   ,@col_no    INT=1
   ,@order_no  INT=0
)
AS
BEGIN

SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)

  SET @stmt = 'SELECT * FROM dbo.wings_v WHERE is_active = ''' + @is_active + ''''
 
  IF ISNULL(@wing_id,'') <> '' 	 
	 SET @stmt = @stmt + ' and wing_id = ' + cast(@wing_id as varchar(20)); 
 
  SET @stmt = @stmt + ' ORDER BY ' + CAST(@col_no as varchar(20)) 
  
  IF @order_no = 0
     SET @stmt = @stmt + ' ASC'
  ELSE
  	 SET @stmt = @stmt + ' DESC'

  EXEC(@stmt)
END
