CREATE PROCEDURE [dbo].[default_packages_sel]
AS
BEGIN
  SELECT * FROM dbo.default_packages order by seq_no
END