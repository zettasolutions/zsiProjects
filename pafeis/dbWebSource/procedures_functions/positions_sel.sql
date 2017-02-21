
CREATE PROCEDURE [dbo].[positions_sel]
(
  @is_active char(1)='Y'
)
AS

BEGIN
  SELECT * FROM dbo.positions WHERE is_active=@is_active;
END


