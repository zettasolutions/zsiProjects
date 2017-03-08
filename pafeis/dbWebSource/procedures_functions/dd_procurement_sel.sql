CREATE PROCEDURE [dbo].[dd_procurement_sel]
   @dealer_id   INT
  ,@status_code nvarchar(5)
AS
BEGIN
SET NOCOUNT ON
DECLARE @stmt NVARCHAR(MAX)
   SELECT procurement_id, procurement_code FROM procurement_v where supplier_id=@dealer_id and status_code=@status_code
END
